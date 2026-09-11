# Interviewer Key

This file should NOT be given to the candidate.

The exercise intentionally contains issues of different severity.

## High-value issues

### 1. Async request race condition
`searchUsers()` deliberately returns one-character searches slowly and longer
searches quickly.

Typing `a`, then quickly `an`, can allow the stale `a` response to arrive last
and overwrite the newer result.

Good fixes include an AbortController with a real HTTP request, request IDs, or
ignoring stale responses in the effect cleanup.

### 2. State mutation: favorites
`splice()` and `push()` mutate the existing `favorites` array and then pass the
same reference back to React.

A candidate should use immutable updates.

### 3. State mutation: selected user
`selectedUser.role = "admin"` mutates an existing object, then passes the same
reference to `setSelectedUser`.

It also creates inconsistent state because `users` still owns the original
collection.

### 4. Duplicated source of truth
Both `selectedUserId` and `selectedUser` represent the same selection.

Prefer storing the ID and deriving the user from the users collection, or
another clearly defined single source of truth.

### 5. Derived state stored unnecessarily
`visibleUsers` is derived from `users` and `query`.

It does not need its own state/effect and can become stale.

There is also a deliberate missing `query` dependency in that effect.

### 6. Unsafe non-null assertions
Both:

```ts
users.find(...)!
```

can crash if the selected user is not present in the current result set.

This is easy to reproduce after selecting a user and then changing the search.

### 7. Array index used as React key
The filtered result can change order/membership. `user.id` is the stable key.

### 8. `any` event parameter
`handleInputChange(event: any)` throws away useful TypeScript checking.

A suitable type is `React.ChangeEvent<HTMLInputElement>`.

## Behavioral / UX issues

### 9. Nested button click bubbles to row
Clicking the favorite button also invokes the parent row's `onClick`, selecting
that user. A candidate may stop propagation or redesign the markup.

### 10. Clickable `div` is inaccessible
The user row behaves like an interactive control but has no keyboard semantics.

A candidate may use a button/link or add appropriate keyboard and accessibility
behavior.

### 11. Loading state is vulnerable to overlapping requests
An older request may set loading to false while a newer request is still in
flight.

This is closely related to the race-condition problem.

### 12. Error handling is swallowed
The catch handler silently clears loading but gives the user no feedback.

### 13. Selection can become inconsistent with search results
Changing the query can remove the selected user from `users`, while the
selection ID/object remains.

A strong candidate should at least notice and discuss the desired behavior.

## Discussion points

Useful follow-up questions:

- Which three issues would you fix first in production?
- Which bugs could lead to incorrect user-visible behavior?
- Would `useMemo` be appropriate for `visibleUsers`? Is it necessary?
- How would this change if `searchUsers` were a real `fetch` request?
- Where should error/loading state live?
- Would you keep fetching on every keystroke, or debounce?
- How would you test the race condition?
- What changes if the result list contains thousands of users?
- Would you split `App` into components? Where and why?

## What a strong candidate often does

- Reproduces the race condition instead of only reading the code.
- Distinguishes correctness bugs from stylistic preferences.
- Avoids overengineering.
- Uses immutable state updates.
- Reduces duplicated/derived state.
- Handles missing values without `!`.
- Uses meaningful TypeScript types rather than `any`.
- Notices accessibility and event propagation.
- Explains trade-offs instead of claiming there is one mandatory solution.
