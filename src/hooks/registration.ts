import { AccountConfig } from "./accountConfig.js";
import { CloudinaryAccountHook } from "./cloudinaryAccountHook.js";
import { CustomHeadersHook } from "./customHeadersHook.js";
import { ResponseHeadersHook } from "./responseHeadersHook.js";
import { UserAgentHook } from "./userAgentHook.js";
import { Hooks } from "./types.js";

/*
 * This file is only ever generated once on the first generation and then is free to be modified.
 * Any hooks you wish to add should be registered in the initHooks function. Feel free to define them
 * in this file or in separate files in the hooks folder.
 */

export function initHooks(hooks: Hooks) {
  const config = new AccountConfig();
  const accountHook = new CloudinaryAccountHook(config);

  hooks.registerSDKInitHook(accountHook);
  hooks.registerBeforeRequestHook(accountHook);
  hooks.registerBeforeRequestHook(new CustomHeadersHook());
  hooks.registerAfterSuccessHook(new ResponseHeadersHook(config.collectHeaders));
  hooks.registerSDKInitHook(new UserAgentHook());
}
