# Propagate KAG Bans

This program propagates bans to all connected servers, preventing banned players from switching servers to continue being a shithead. The plan for this is for it to eventually be used on all official KAG servers. However, feel free to use this on your own servers if you need to shit on the shitheads.

# Prerequisites

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)

# Setup

For now, add servers to `src/index.ts` and compile using `npm run-script compile`.  
To change the reconnect interval, manually change it at the top of `src/server.ts` and recompile.
