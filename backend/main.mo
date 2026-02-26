import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ========== USER PROFILE ==========

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view your profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ========== WEBSITE CONTENT DATA TYPES ==========

  public type HomepageContent = {
    heroText : Text;
    tagline : Text;
    aboutUs : Text;
    learningMethods : Text;
    studentConnection : Text;
    schoolAddress : Text;
    contactInfo : Text;
  };

  public type FeeCategory = {
    title : Text;
    amount : Nat;
  };

  module FeeCategory {
    public func compare(a : FeeCategory, b : FeeCategory) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  public type PaymentStatus = { #unpaid; #paid; #pending };

  public type FeePaymentRecord = {
    studentName : Text;
    feeTitle : Text;
    amount : Nat;
    status : PaymentStatus;
    recordId : Nat;
  };

  module FeePaymentRecord {
    public func compare(a : FeePaymentRecord, b : FeePaymentRecord) : Order.Order {
      switch (Text.compare(a.studentName, b.studentName)) {
        case (#equal) { Nat.compare(a.recordId, b.recordId) };
        case (other) { other };
      };
    };
  };

  // ========== Persistent State ==========

  var nextRecordId = 1;
  var homepageContent : HomepageContent = {
    heroText = "";
    tagline = "";
    aboutUs = "";
    learningMethods = "";
    studentConnection = "";
    schoolAddress = "";
    contactInfo = "Email: indokidz@school.in | Phone: +91-XXXXXXXXXX";
  };

  let feeCategories = Map.empty<Text, FeeCategory>();
  let paymentRecords = Map.empty<Nat, FeePaymentRecord>();

  // Internal state for actor owner
  var owner : ?Principal = null;

  // Check if owner has been set
  public query func hasOwner() : async Bool {
    owner != null;
  };

  // Validate if current caller is the owner
  public query ({ caller }) func isOwner() : async Bool {
    switch (owner) {
      case (null) { false };
      case (?principal) { principal == caller };
    };
  };

  // Register current caller as an owner if and only if no owner has been registered
  // Registering the owner must not override existing owners
  public shared ({ caller }) func registerOwner() : async () {
    switch (owner) {
      case (null) {
        owner := ?caller;
      };
      case (?principal) {
        if (caller != principal) {
          Runtime.trap("Owner already registered: This action can only be performed once.");
        };
      };
    };
  };

  // ========== Admin-Only Functions ==========

  // Edit homepage/site content
  public shared ({ caller }) func updateHomepageContent(newContent : HomepageContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    homepageContent := newContent;
  };

  // Add new fee category
  public shared ({ caller }) func addFeeCategory(title : Text, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let category = { title; amount };
    feeCategories.add(title, category);
  };

  // Update existing fee category
  public shared ({ caller }) func updateFeeCategory(title : Text, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not feeCategories.containsKey(title)) {
      Runtime.trap("Fee category not found");
    };
    feeCategories.add(title, { title; amount });
  };

  // Delete fee category
  public shared ({ caller }) func deleteFeeCategory(title : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    feeCategories.remove(title);
  };

  // View all fee payment records (admin only)
  public query ({ caller }) func getAllPaymentRecords() : async [FeePaymentRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    paymentRecords.values().toArray().sort();
  };

  // Update payment record status (admin only)
  public shared ({ caller }) func updatePaymentStatus(recordId : Nat, status : PaymentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (paymentRecords.get(recordId)) {
      case (null) {
        Runtime.trap("Payment record not found");
      };
      case (?record) {
        let updatedRecord = {
          record with
          status
        };
        paymentRecords.add(recordId, updatedRecord);
      };
    };
  };

  // ========== PUBLIC (UNPROTECTED) FUNCTIONS ==========

  // Get homepage/site content — publicly accessible, no auth required
  public query func getHomepageContent() : async HomepageContent {
    homepageContent;
  };

  // Get available fee categories — publicly accessible, no auth required
  public query func getFeeCategories() : async [FeeCategory] {
    feeCategories.values().toArray().sort();
  };

  // Submit a fee payment record — publicly accessible, no auth required
  public shared func submitFeePayment(studentName : Text, feeTitle : Text, amount : Nat) : async Nat {
    let record = {
      studentName;
      feeTitle;
      amount;
      status = #unpaid;
      recordId = nextRecordId;
    };
    paymentRecords.add(nextRecordId, record);
    nextRecordId += 1;
    record.recordId;
  };

  // Get specific payment record — publicly accessible, no auth required
  public query func getPaymentRecord(recordId : Nat) : async FeePaymentRecord {
    switch (paymentRecords.get(recordId)) {
      case (null) { Runtime.trap("Payment record not found") };
      case (?record) { record };
    };
  };

  // Get all payment records for a student — publicly accessible, no auth required
  public query func getStudentRecords(studentName : Text) : async [FeePaymentRecord] {
    let iter = paymentRecords.values().filter(
      func(record) { record.studentName == studentName }
    );
    iter.toArray().sort();
  };
};
