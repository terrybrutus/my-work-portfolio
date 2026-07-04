import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";

actor {
  include MixinViews();

  let accessControlState : AccessControl.AccessControlState;

  include MixinAuthorization(accessControlState, null);
};
