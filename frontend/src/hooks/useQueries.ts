import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, PaymentStatus, HomepageContent } from '../backend';
import { UserRole } from '../backend';

// ========== USER PROFILE ==========

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ========== OWNER ==========

export function useHasOwner() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasOwner'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasOwner();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useIsOwner() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isOwner', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isOwner();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // Use isPending (not isLoading) so that a disabled/not-yet-run query is
  // treated as "still loading" — prevents premature false negatives.
  const queryPending = query.isPending;

  return {
    isOwner: query.data ?? false,
    // Loading while: actor is initialising OR query hasn't resolved yet
    isLoading: actorFetching || (!!identity && queryPending),
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegisterOwner() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Step 1: register as owner
      await actor.registerOwner();
      // Step 2: grant the owner admin role so backend admin-gated operations work.
      // _initializeAccessControlWithSecret is called at actor creation time; if it
      // bootstrapped admin access the call below succeeds. If not, we try anyway
      // and swallow the error so registration itself is not blocked.
      if (identity) {
        try {
          await actor.assignCallerUserRole(identity.getPrincipal(), UserRole.admin);
        } catch {
          // Non-fatal: admin role assignment may already be handled by the
          // access-control initialisation in useActor.ts.
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['hasOwner'] });
      await queryClient.refetchQueries({ queryKey: ['hasOwner'] });
      await queryClient.invalidateQueries({ queryKey: ['isOwner'] });
      await queryClient.refetchQueries({ queryKey: ['isOwner'] });
    },
  });
}

// ========== HOMEPAGE CONTENT ==========

export function useGetHomepageContent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHomepageContent();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateHomepageContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: HomepageContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHomepageContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
    },
  });
}

// ========== FEE CATEGORIES ==========

export function useGetFeeCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['feeCategories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeeCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddFeeCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, amount }: { title: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFeeCategory(title, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeCategories'] });
    },
  });
}

export function useUpdateFeeCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, amount }: { title: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFeeCategory(title, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeCategories'] });
    },
  });
}

export function useDeleteFeeCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFeeCategory(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeCategories'] });
    },
  });
}

// ========== PAYMENT RECORDS ==========

export function useGetAllPaymentRecords() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['allPaymentRecords'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPaymentRecords();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, status }: { recordId: bigint; status: PaymentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePaymentStatus(recordId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPaymentRecords'] });
    },
  });
}

export function useSubmitFeePayment() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      studentName,
      feeTitle,
      amount,
    }: {
      studentName: string;
      feeTitle: string;
      amount: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeePayment(studentName, feeTitle, amount);
    },
  });
}
