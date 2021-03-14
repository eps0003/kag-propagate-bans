# Propagate KAG Bans

This program propagates bans to all connected servers, preventing banned players from switching servers to continue being a shithead. The plan for this is for it to eventually be used on all official KAG servers. However, feel free to use this on your own servers if you need to shit on the shitheads.

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)

## Setup

1. Add servers to `config.json`
2. Optionally adjust the reconnect interval at the top of `src/server.ts`
3. Compile the program using `npm run-script compile`
4. Create an AngelScript file with the following code and add it to the `gamemode.cfg` of every gamemode your servers host:

   ```angelscript
   #define SERVER_ONLY

   void onBan(const string username, const int minutes, const string reason)
   {
       tcpr("BAN " + username + " " + minutes + " " + reason);
   }

   void onUnban(const string username)
   {
       tcpr("UNBAN " + username);
   }
   ```

5. Ensure the following settings are applied to `autoconfig.cfg`:
   - `sv_tcpr = 1`
   - `sv_tcpr_timestamp = 0`
6. Run the program using `npm run-script run`

## Docker

1. Build: `docker build . -tkag-propagate-bans`
2. Run: `docker run -d --rm -v config.json:/kag-propagate-bans/config.json kag-propagate-bans`
