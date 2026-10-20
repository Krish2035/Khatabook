/**
 * Khatabook Offline Synchronization & Outbox Manager
 * Implements Architecture Pillar 14 (Idempotency) & Pillar 27 (Chunked/Batch Synchronization)
 */

const OUTBOX_STORAGE_KEY = 'khatabook_offline_outbox';
const CACHE_TX_KEY = 'khatabook_cached_transactions';
const CACHE_SUMMARY_KEY = 'khatabook_cached_summary';

export const getOutbox = () => {
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read offline outbox:', err);
    return [];
  }
};

export const saveOutbox = (outbox) => {
  try {
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(outbox));
  } catch (err) {
    console.error('Failed to save offline outbox:', err);
  }
};

export const addToOutbox = (action, data, id = null) => {
  const outbox = getOutbox();
  const txId = id || data?.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const op = {
    outboxId: `op_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    action, // 'CREATE' | 'UPDATE' | 'DELETE'
    id: txId,
    data: data ? { ...data, id: txId } : null,
    timestamp: new Date().toISOString(),
  };

  // If there's an existing pending operation for the same txId, coalesce them
  const existingIdx = outbox.findIndex((item) => item.id === txId);
  if (existingIdx !== -1) {
    if (outbox[existingIdx].action === 'CREATE' && action === 'DELETE') {
      // Created offline then deleted offline: remove both
      outbox.splice(existingIdx, 1);
    } else if (outbox[existingIdx].action === 'CREATE' && action === 'UPDATE') {
      outbox[existingIdx].data = { ...outbox[existingIdx].data, ...data };
    } else {
      outbox[existingIdx] = op;
    }
  } else {
    outbox.push(op);
  }

  saveOutbox(outbox);
  return op;
};

export const clearOutbox = () => {
  try {
    localStorage.removeItem(OUTBOX_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear outbox:', err);
  }
};

export const getCachedTransactions = () => {
  try {
    const raw = localStorage.getItem(CACHE_TX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setCachedTransactions = (transactions) => {
  try {
    localStorage.setItem(CACHE_TX_KEY, JSON.stringify(transactions));
  } catch {}
};

export const getCachedSummary = () => {
  try {
    const raw = localStorage.getItem(CACHE_SUMMARY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCachedSummary = (summary) => {
  try {
    localStorage.setItem(CACHE_SUMMARY_KEY, JSON.stringify(summary));
  } catch {}
};

/**
 * Sync all pending outbox operations to backend in chunks
 */
export const syncOutboxInChunks = async (syncApiCall, chunkSize = 10) => {
  const outbox = getOutbox();
  if (outbox.length === 0) return { totalSynced: 0 };

  console.log(`[Offline Sync] Starting chunked synchronization of ${outbox.length} pending operations...`);
  let syncedCount = 0;

  // Process in chunks
  for (let i = 0; i < outbox.length; i += chunkSize) {
    const chunk = outbox.slice(i, i + chunkSize);
    const operations = chunk.map((op) => ({
      action: op.action,
      id: op.id,
      data: op.data,
    }));

    await syncApiCall(operations);
    syncedCount += chunk.length;
  }

  clearOutbox();
  console.log(`[Offline Sync] Successfully synchronized all ${syncedCount} operations to database!`);
  return { totalSynced: syncedCount };
};
