<template>
  <div class="hub-container">
    <div class="welcome">
      <span v-if="userStore.data" class="welcome__username"
        >Welcome
        {{
          userStore.data.user_metadata.preferred_name.length > 0
            ? userStore.data.user_metadata.preferred_name
            : userStore.data.email
        }}
      </span>
    </div>
    <div class="weather">
      <WeatherDisplay />
    </div>
    <div class="tasks">
      <TaskCreate class="tasks__create" />
      <TaskList class="tasks__list" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hub-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}
// SHARED PROPERTIES FOR EACH SECTION
.welcome,
.weather {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: hsla(0, 0%, 12.5%, 80%);
}
.welcome {
  grid-column: 1;
  &__username {
    font-size: 2rem;
  }
}
.weather {
  grid-column: 2 / 4;
}
.tasks {
  grid-column: 1 / 4;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  border-radius: 0.5rem;
  background-color: hsla(0, 0%, 12.5%, 80%);
  &__create,
  &__list {
    padding: 1rem;
  }
  &__create {
    grid-column: 1;
  }
  &__list {
    grid-column: 2 / 4;
  }
}
</style>

<script setup lang="ts">
definePageMeta({ middleware: "auth-mw" });
const userStore = useUserStore();
onMounted(async () => {
  if (!userStore.data) await userStore.fetchData();
  const userMetaData = {
    preferred_name: "Kieran",
    country_id: convertCountry("United Kingdom"),
    locale: "Runcorn",
  };
  // const { data, error } = await useSupabaseAuthClient().auth.updateUser({
  //   data: userMetaData,
  // });
});
</script>
