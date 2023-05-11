export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser();
  const notifications = useNotificationsStore();
  if (!user.value) {
    notifications.setMessage(
      "You must be logged in to access this resource",
      "error"
    );
    return navigateTo("/login");
  }
});
