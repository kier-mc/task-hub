export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const request = await useSupabaseClient().auth.getUser();
  if (!request.data.user) {
    return navigateTo("/login", { redirectCode: 401 });
  }
});
