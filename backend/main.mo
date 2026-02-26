import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ========== USER PROFILE ==========

  public type UserProfile = {
    name : Text;
    contactInfo : Text;
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

  // ========== SCHOOL INFO ==========
  public type SchoolInfo = {
    schoolName : Text;
    adminContactInfo : Text;
    phoneNumber : Text;
    emailAddress : Text;
    address : Text;
    principalName : Text;
    facebookLink : Text;
    twitterLink : Text;
    instagramLink : Text;
    website : Text;
  };

  var schoolInfo : SchoolInfo = {
    schoolName = "Indokidz School";
    adminContactInfo = "";
    phoneNumber = "+91-XXXXXXXXXX";
    emailAddress = "indokidz@school.in";
    address = "Teosa, Maharashtra, 444902";
    principalName = "Default School Name";
    facebookLink = "https://facebook.com/IndokidzSchool";
    twitterLink = "https://twitter.com/IndokidzSchool";
    instagramLink = "https://instagram.com/IndokidzSchool";
    website = "https://www.indokidzschool.in";
  };

  public query func getSchoolInfo() : async SchoolInfo {
    schoolInfo;
  };

  public shared ({ caller }) func updateSchoolInfo(
    schoolName : Text,
    adminContactInfo : Text,
    phoneNumber : Text,
    emailAddress : Text,
    address : Text,
    principalName : Text,
    facebookLink : Text,
    twitterLink : Text,
    instagramLink : Text,
    website : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update school info");
    };
    schoolInfo := {
      schoolName;
      adminContactInfo;
      phoneNumber;
      emailAddress;
      address;
      principalName;
      facebookLink;
      twitterLink;
      instagramLink;
      website;
    };
  };

  // ========== FEE CATEGORY ==========
  public type FeeCategory = {
    id : Nat;
    name : Text;
    amount : Nat;
  };

  let feeCategories = Map.empty<Nat, FeeCategory>();
  var nextFeeCategoryId = 1;

  public shared ({ caller }) func addFeeCategory(name : Text, amount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextFeeCategoryId;
    let category = { id; name; amount };
    feeCategories.add(id, category);
    nextFeeCategoryId += 1;
    id;
  };

  public shared ({ caller }) func updateFeeCategory(id : Nat, name : Text, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (feeCategories.get(id)) {
      case (null) { Runtime.trap("Fee category not found") };
      case (?_) {
        let updatedCategory = { id; name; amount };
        feeCategories.add(id, updatedCategory);
      };
    };
  };

  public shared ({ caller }) func deleteFeeCategory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not feeCategories.containsKey(id)) {
      Runtime.trap("Fee category not found");
    };
    feeCategories.remove(id);
  };

  public query func getFeeCategories() : async [FeeCategory] {
    feeCategories.values().toArray();
  };

  // ========== GALLERY ==========
  public type Photo = {
    id : Nat;
    url : Text; // could be base64 or a URL
    caption : Text;
  };

  let photoStore = Map.empty<Nat, Photo>();
  var nextPhotoId = 1;

  public shared ({ caller }) func addPhoto(url : Text, caption : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add photos");
    };
    let id = nextPhotoId;
    let photo = { id; url; caption };
    photoStore.add(id, photo);
    nextPhotoId += 1;
    id;
  };

  public shared ({ caller }) func deletePhoto(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete photos");
    };
    switch (photoStore.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?_) { photoStore.remove(id) };
    };
  };

  public query func getGallery() : async [Photo] {
    photoStore.values().toArray();
  };

  // ========== HOME CONTENT ==========
  public type HeroStats = {
    studentsEnrolled : Nat;
    yearsOfExcellence : Nat;
    facultyCount : Nat;
  };

  public type SchoolHighlights = {
    highlight1 : Text;
    highlight2 : Text;
    highlight3 : Text;
    // Add more highlights as needed
  };

  public type Testimonial = {
    name : Text;
    designation : Text;
    feedback : Text;
  };

  public type HomeHeroSection = {
    schoolName : Text;
    tagline : Text;
    address : Text;
    heroStats : HeroStats;
    schoolHighlights : SchoolHighlights;
    testimonials : [Testimonial];
  };

  var homeHeroSection : HomeHeroSection = {
    schoolName = "INDO KIDZ";
    tagline = "Where Little Minds Bloom into Big Dreams";
    address = "Beside Nikhil Ashram, 495006, Bilaspur, Chhattisgarh";
    heroStats = {
      studentsEnrolled = 250;
      yearsOfExcellence = 9;
      facultyCount = 15;
    };
    schoolHighlights = {
      highlight1 = "Spacious 3-acre campus in prime city location";
      highlight2 = "Vast playground, digital classrooms, smart library";
      highlight3 = "Highly qualified 1-to-15 teacher ratio";
    };
    testimonials = [
      {
        name = "Rakesh Sharma";
        designation = "Parent";
        feedback = "Excellent caring teachers, top city facilities, holistic child development.";
      },
      {
        name = "Pooja Singh";
        designation = "Parent";
        feedback = "State-of-the-art technology aids in child growth and creativity.";
      },
      {
        name = "Sunita Mishra";
        designation = "Local Principal";
        feedback = "Impressive focus on learning, critical thinking and individual development.";
      },
    ];
  };

  public query func getHomeHeroSection() : async HomeHeroSection {
    homeHeroSection;
  };

  public shared ({ caller }) func updateHomeHeroSection(
    schoolName : Text,
    tagline : Text,
    address : Text,
    stats : HeroStats,
    highlights : SchoolHighlights,
    testimonials : [Testimonial],
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can update hero section") };
    homeHeroSection := {
      schoolName;
      tagline;
      address;
      heroStats = stats;
      schoolHighlights = highlights;
      testimonials;
    };
  };

  // ========== ADMISSIONS CONTENT ==========
  public type AdmissionsContent = {
    eligibility : Text;
    process : Text;
    documents : Text;
    applicationSteps : Text;
    portalLink : Text;
    faq : Text;
  };

  var admissionsContent : AdmissionsContent = {
    eligibility = "";
    process = "";
    documents = "";
    applicationSteps = "";
    portalLink = "";
    faq = "";
  };

  public query func getAdmissionsContent() : async AdmissionsContent {
    admissionsContent;
  };

  public shared ({ caller }) func updateAdmissionsContent(
    eligibility : Text,
    process : Text,
    documents : Text,
    applicationSteps : Text,
    portalLink : Text,
    faq : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can update content") };
    admissionsContent := {
      eligibility;
      process;
      documents;
      applicationSteps;
      portalLink;
      faq;
    };
  };

  // ========== ANNOUNCEMENTS ==========
  public type Announcement = {
    title : Text;
    body : Text;
    date : Text;
  };

  let announcementsStore = Map.empty<Nat, Announcement>();
  var nextAnnouncementId = 1;

  public shared ({ caller }) func addAnnouncement(title : Text, body : Text, date : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can add announcements") };
    let id = nextAnnouncementId;
    let announcement = { title; body; date };
    announcementsStore.add(id, announcement);
    nextAnnouncementId += 1;
    id;
  };

  public query func getAnnouncement(id : Nat) : async Announcement {
    switch (announcementsStore.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?announcement) { announcement };
    };
  };

  public query func getAllAnnouncements() : async [Announcement] {
    announcementsStore.values().toArray();
  };

  public shared ({ caller }) func updateAnnouncement(id : Nat, title : Text, body : Text, date : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can update announcements") };
    switch (announcementsStore.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?_) {
        let updatedAnnouncement = { title; body; date };
        announcementsStore.add(id, updatedAnnouncement);
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can delete announcements") };
    switch (announcementsStore.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?_) { announcementsStore.remove(id) };
    };
  };

  // ========== THEME SETTINGS ==========
  public type ThemeSettings = {
    primaryColor : Text;
    accentColor : Text;
    fontChoice : Text;
  };

  var themeSettings : ThemeSettings = {
    primaryColor = "#5eacd8";
    accentColor = "#fcb900";
    fontChoice = "Open Sans";
  };

  public query func getThemeSettings() : async ThemeSettings {
    themeSettings;
  };

  public shared ({ caller }) func updateThemeSettings(
    primaryColor : Text,
    accentColor : Text,
    fontChoice : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can update theme") };
    themeSettings := { primaryColor; accentColor; fontChoice };
  };
};
