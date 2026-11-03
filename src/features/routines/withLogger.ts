export function withLogger<S, A extends { type: string }>(
  reducer: (state: S, action: A) => S
): (state: S, action: A) => S {
  return (prevState: S, action: A): S => {
    const nextState = reducer(prevState, action);
    if (import.meta.env.DEV) {
      console.log(`Action: ${action.type}`, {
        prev: prevState,
        next: nextState,
      });
    }
    return nextState;
  };
}

