import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HomepageContent {
    contactInfo: string;
    aboutUs: string;
    tagline: string;
    learningMethods: string;
    studentConnection: string;
    heroText: string;
    schoolAddress: string;
}
export interface FeePaymentRecord {
    status: PaymentStatus;
    studentName: string;
    feeTitle: string;
    recordId: bigint;
    amount: bigint;
}
export interface FeeCategory {
    title: string;
    amount: bigint;
}
export interface UserProfile {
    name: string;
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    unpaid = "unpaid"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFeeCategory(title: string, amount: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteFeeCategory(title: string): Promise<void>;
    getAllPaymentRecords(): Promise<Array<FeePaymentRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeeCategories(): Promise<Array<FeeCategory>>;
    getHomepageContent(): Promise<HomepageContent>;
    getPaymentRecord(recordId: bigint): Promise<FeePaymentRecord>;
    getStudentRecords(studentName: string): Promise<Array<FeePaymentRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasOwner(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isOwner(): Promise<boolean>;
    registerOwner(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitFeePayment(studentName: string, feeTitle: string, amount: bigint): Promise<bigint>;
    updateFeeCategory(title: string, amount: bigint): Promise<void>;
    updateHomepageContent(newContent: HomepageContent): Promise<void>;
    updatePaymentStatus(recordId: bigint, status: PaymentStatus): Promise<void>;
}
