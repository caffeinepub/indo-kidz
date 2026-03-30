import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Photo {
    id: bigint;
    url: string;
    caption: string;
}
export interface HeroStats {
    facultyCount: bigint;
    yearsOfExcellence: bigint;
    studentsEnrolled: bigint;
}
export interface AdmissionsContent {
    faq: string;
    applicationSteps: string;
    portalLink: string;
    documents: string;
    eligibility: string;
    process: string;
}
export interface ThemeSettings {
    primaryColor: string;
    accentColor: string;
    fontChoice: string;
}
export interface FeeCategory {
    id: bigint;
    name: string;
    amount: bigint;
}
export interface ContactMessage {
    id: bigint;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface SchoolInfo {
    instagramLink: string;
    twitterLink: string;
    adminContactInfo: string;
    website: string;
    address: string;
    principalName: string;
    facebookLink: string;
    emailAddress: string;
    phoneNumber: string;
    schoolName: string;
}
export interface SchoolHighlights {
    highlight1: string;
    highlight2: string;
    highlight3: string;
}
export interface HomeHeroSection {
    tagline: string;
    heroStats: HeroStats;
    address: string;
    schoolHighlights: SchoolHighlights;
    testimonials: Array<Testimonial>;
    schoolName: string;
}
export interface Announcement {
    title: string;
    body: string;
    date: string;
}
export interface PaymentRequest {
    id: bigint;
    categoryId: bigint;
    status: Variant_pending_approved_rejected;
    timestamp: bigint;
    payer: Principal;
    amount: bigint;
}
export interface UserProfile {
    contactInfo: string;
    name: string;
}
export interface Testimonial {
    name: string;
    designation: string;
    feedback: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addAnnouncement(title: string, body: string, date: string): Promise<bigint>;
    addFeeCategory(name: string, amount: bigint): Promise<bigint>;
    addPhoto(url: string, caption: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteFeeCategory(id: bigint): Promise<void>;
    deletePaymentRequest(id: bigint): Promise<void>;
    deletePhoto(id: bigint): Promise<void>;
    getAdmissionsContent(): Promise<AdmissionsContent>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllPaymentRequests(): Promise<Array<PaymentRequest>>;
    getAnnouncement(id: bigint): Promise<Announcement>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getFeeCategories(): Promise<Array<FeeCategory>>;
    getGallery(): Promise<Array<Photo>>;
    getHomeHeroSection(): Promise<HomeHeroSection>;
    getPaymentRequestsByStatus(status: Variant_pending_approved_rejected): Promise<Array<PaymentRequest>>;
    getSchoolInfo(): Promise<SchoolInfo>;
    getThemeSettings(): Promise<ThemeSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactMessage(name: string, email: string, phone: string, subject: string, message: string, timestamp: bigint): Promise<void>;
    submitPaymentRequest(categoryId: bigint, amount: bigint): Promise<bigint>;
    updateAdmissionsContent(eligibility: string, process: string, documents: string, applicationSteps: string, portalLink: string, faq: string): Promise<void>;
    updateAnnouncement(id: bigint, title: string, body: string, date: string): Promise<void>;
    updateFeeCategory(id: bigint, name: string, amount: bigint): Promise<void>;
    updateHomeHeroSection(schoolName: string, tagline: string, address: string, stats: HeroStats, highlights: SchoolHighlights, testimonials: Array<Testimonial>): Promise<void>;
    updatePaymentRequestStatus(id: bigint, newStatus: Variant_pending_approved_rejected): Promise<void>;
    updateSchoolInfo(schoolName: string, adminContactInfo: string, phoneNumber: string, emailAddress: string, address: string, principalName: string, facebookLink: string, twitterLink: string, instagramLink: string, website: string): Promise<void>;
    updateThemeSettings(primaryColor: string, accentColor: string, fontChoice: string): Promise<void>;
}
