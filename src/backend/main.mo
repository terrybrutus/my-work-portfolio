import Array "mo:core/Array";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";

actor {
  public type StoredReviewerView = {
    slug : Text;
    labelText : Text;
    context : Text;
    headline : Text;
    summary : Text;
    lanes : [Text];
    projectIds : [Text];
    proofIds : [Text];
    skillIds : [Text];
    createdAt : Text;
  };

  stable var reviewerViews : [StoredReviewerView];

  include MixinViews();

  let accessControlState : AccessControl.AccessControlState;

  include MixinAuthorization(accessControlState, null);

  public query func getReviewerView(slug : Text) : async ?StoredReviewerView {
    for (view in reviewerViews.vals()) {
      if (view.slug == slug) {
        return ?view;
      };
    };

    null;
  };

  public shared func saveReviewerView(view : StoredReviewerView) : async () {
    let existingViews = Array.filter<StoredReviewerView>(reviewerViews, func(item : StoredReviewerView) : Bool { item.slug != view.slug });
    reviewerViews := Array.concat<StoredReviewerView>([view], existingViews);
  };
};
