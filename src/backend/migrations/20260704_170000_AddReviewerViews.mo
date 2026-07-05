import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

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

  type OldActor = {
    accessControlState : AccessControlState;
  };

  type NewActor = {
    accessControlState : AccessControlState;
    reviewerViews : [StoredReviewerView];
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      reviewerViews = [];
    };
  };
};
