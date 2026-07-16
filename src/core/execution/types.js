export const ExecutionEvent = {
  CALL: 'CALL',
  RETURN: 'RETURN',
  BASE_CASE: 'BASE_CASE',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  WAITING: 'WAITING'
};

export const getTypeColorClass = (eventType) => {
  switch (eventType) {
    case ExecutionEvent.CALL:
      return 'badge-call';
    case ExecutionEvent.RETURN:
      return 'badge-return';
    case ExecutionEvent.BASE_CASE:
      return 'badge-base-case';
    case ExecutionEvent.COMPLETE:
      return 'badge-complete';
    case ExecutionEvent.ERROR:
      return 'badge-error';
    case ExecutionEvent.WAITING:
    default:
      return 'badge-waiting';
  }
};
