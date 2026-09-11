interface CartVisibilityInput {
  isAdmin: boolean;
  cartItemCount: number;
  isRolePending?: boolean;
}

export const shouldShowCart = ({ isAdmin, cartItemCount, isRolePending = false }: CartVisibilityInput) => (
  !isAdmin && !isRolePending && cartItemCount > 0
);
