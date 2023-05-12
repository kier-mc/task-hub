export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const notificationsStore = useNotificationsStore();
  const request = await useSupabaseAuthClient().auth.getUser();
  if (!request.data.user) {
    notificationsStore.setMessage(
      "You must be signed in to view this page",
      "error"
    );
    return navigateTo("/login", { redirectCode: 401 });
  }
});
