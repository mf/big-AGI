import { fileOpen, fileSave, FileWithHandle } from 'browser-fs-access';

import { SystemPurposeId, SystemPurposes } from '../../data';

import { useModelsStore } from '~/modules/llms/store-llms';

import { Brand } from '~/common/app.config';
import { DataAtRestV1 } from '~/common/stores/chat/converters';
import { capitalizeFirstLetter } from '~/common/util/textUtils';
import { conversationTitle, DConversation } from '~/common/stores/chat/chat.conversation';
import { messageFragmentsReduceText } from '~/common/stores/chat/chat.message';
import { prettyBaseModel } from '~/common/util/modelUtils';
import { prettyTimestampForFilenames } from '~/common/util/timeUtils';
import { useChatStore } from '~/common/stores/chat/store-chats';
import { useFolderStore } from '~/common/state/store-folders';

import type { ImportedOutcome } from './ImportOutcomeModal';


/// IMPORT ///

/**
 * Open a file dialog and load all conversations from the selected JSON files
 */
export async function openAndLoadConversations(preventClash: boolean = false): Promise<ImportedOutcome | null> {
  const outcome: ImportedOutcome = { conversations: [], activateConversationId: null };

  let blobs: FileWithHandle[];
  try {
    blobs = await fileOpen({
      description: `${Brand.Title.Base} JSON Conversations`,
      mimeTypes: ['application/json', 'application/big-agi'],
      multiple: true,
    });
  } catch (error) {
    // User closed the dialog
    return null;
  }

  // unroll files to conversations
  for (const blob of blobs) {
    const fileName = blob.name || 'unknown file';
    try {
      const fileString = await blob.text();
      const fileObject = JSON.parse(fileString);
      loadConversationsFromAtRestV1(fileName, fileObject, outcome);
    } catch (error: any) {
      outcome.conversations.push({
        success: false,
        fileName,
        error: `Invalid file: ${error?.message || error?.toString() || 'unknown error'}`,
      });
    }
  }

  // import conversations
  for (const cOutcome of [...outcome.conversations].reverse()) {
    if (!cOutcome.success)
      continue;
    cOutcome.importedConversationId = useChatStore.getState().importConversation(cOutcome.conversation, preventClash);
    // the last successfully imported is the one to activate
    if (cOutcome.importedConversationId)
      outcome.activateConversationId = cOutcome.importedConversationId;
  }

  return outcome;
}


/**
 * Restores all conversations in a JSON
 *  - supports both  DataAtRestV1.RestAllJsonV1B, and DataAtRestV1.RestChatJsonV1 files
 */
function loadConversationsFromAtRestV1(fileName: string, obj: any, outcome: ImportedOutcome) {
  // heuristics
  const hasConversations = obj.hasOwnProperty('conversations');
  const hasMessages = obj.hasOwnProperty('messages');

  switch (true) {

    // Heuristic (backup): DataAtRestV1.RestAllJsonV1B
    case hasConversations && hasMessages:
      const { conversations, folders } = obj as DataAtRestV1.RestAllJsonV1B;
      for (const conversation of conversations)
        loadSingleChatFromAtRestV1(fileName, conversation, outcome);

      // in ExportedAllJsonV1b+, folders weren't there before
      if (folders?.folders) {
        const dFolders = DataAtRestV1.recreateFolders(folders.folders);
        if (dFolders.length)
          useFolderStore.getState().importFoldersAppend(dFolders, folders.enableFolders);
      }
      break;

    // Heuristic (single):
    case hasMessages && !hasConversations:
      const conversation = obj as DataAtRestV1.RestChatJsonV1;
      loadSingleChatFromAtRestV1(fileName, conversation, outcome);
      break;

    default:
      outcome.conversations.push({ success: false, fileName, error: `Invalid file: ${fileName}` });
      break;

  }
}

function loadSingleChatFromAtRestV1(fileName: string, part: DataAtRestV1.RestChatJsonV1, outcome: ImportedOutcome) {
  const restored = DataAtRestV1.recreateConversation(part);
  if (!restored)
    outcome.conversations.push({ success: false, fileName, error: `Invalid conversation: ${part.id}` });
  else
    outcome.conversations.push({ success: true, fileName, conversation: restored });
}


/// EXPORT ///

/**
 * Download all conversations as a JSON file, for backup and future restore
 * @throws {Error} if the user closes the dialog, or file could not be saved
 */
export async function downloadAllJsonV1B() {
  // conversations and
  const { folders, enableFolders } = useFolderStore.getState();
  const payload = DataAtRestV1.formatAllToJsonV1B(
    useChatStore.getState().conversations,
    useModelsStore.getState().sources,
    folders, enableFolders,
  );
  const json = JSON.stringify(payload);
  const blob = new Blob([json], { type: 'application/json' });

  // save file
  await fileSave(blob, {
    fileName: `backup_chats_${window?.location?.hostname || 'all'}_${payload.conversations.length}_${prettyTimestampForFilenames(false)}.agi.json`,
    // mimeTypes: ['application/json', 'application/big-agi'],
    extensions: ['.json'],
  });
}

/**
 * Download a conversation as a JSON file, for backup and future restore
 * @throws {Error} if the user closes the dialog, or file could not be saved
 */
export async function downloadSingleChat(conversation: DConversation, format: 'json' | 'markdown') {

  let blob: Blob;
  let extension: string;

  if (format == 'json') {

    // remove fields (abortController, etc.) from the export
    const exportableConversation = DataAtRestV1.formatChatToJsonV1(conversation);
    const json = JSON.stringify(exportableConversation, null, 2);
    blob = new Blob([json], { type: 'application/json' });
    extension = '.json';

  } else if (format == 'markdown') {

    const exportableMarkdown = conversationToMarkdown(conversation, false, true, (name: string) => `## ${name} ##`);
    blob = new Blob([exportableMarkdown], { type: 'text/markdown' });
    extension = '.md';

  } else {
    throw new Error(`Invalid download format: ${format}`);
  }

  // const fileConvId = conversation.id.slice(0, 8);
  const fileTitle = conversationTitle(conversation).replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'untitled';

  // save file
  await fileSave(blob, {
    fileName: `conversation_${fileTitle}_${prettyTimestampForFilenames(false)}.agi${extension}`,
    extensions: [extension],
  });
}

/**
 * Primitive rendering of a Conversation to Markdown
 */
export function conversationToMarkdown(conversation: DConversation, hideSystemMessage: boolean, exportTitle: boolean, senderWrap?: (text: string) => string): string {
  const mdTitle = exportTitle
    ? `# ${capitalizeFirstLetter(conversationTitle(conversation, Brand.Title.Common + ' Chat'))}\nA ${Brand.Title.Common} conversation, updated on ${(new Date(conversation.updated || conversation.created)).toLocaleString()}.\n\n`
    : '';
  return mdTitle + conversation.messages.filter(message => !hideSystemMessage || message.role !== 'system').map(message => {
    let senderName: string = message.role === 'user' ? 'You' : 'Bot'; // from role
    let text = messageFragmentsReduceText(message.fragments);
    switch (message.role) {
      case 'system':
        senderName = '✨ System message';
        text = `*${text}*`;
        break;
      case 'assistant':
        const purpose = message.purposeId || conversation.systemPurposeId || null;
        senderName = `${purpose || 'Assistant'} · *${prettyBaseModel(message.originLLM || '')}*`.trim();
        if (purpose && purpose in SystemPurposes)
          senderName = `${SystemPurposes[purpose as SystemPurposeId]?.symbol || ''} ${senderName}`.trim();
        break;
      case 'user':
        senderName = '👤 You';
        break;
    }
    return (senderWrap?.(senderName) || `### ${senderName}`) + `\n\n${text}\n\n`;
  }).join('---\n\n');

}
