export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const request = await useSupabaseAuthClient().auth.getUser();
  if (!request.data.user) {
    return navigateTo("/login", { redirectCode: 401 });
  }
});
