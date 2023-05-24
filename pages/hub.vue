<template>
  <div class="hub-container">
    <div class="welcome">
      <span v-if="user.data.user" class="welcome__username"
        >Welcome
        {{
          user.data.user.user_metadata.name.length > 0
            ? user.data.user.user_metadata.name
            : user.data.user.email
        }}
      </span>
    </div>
    <div class="weather">Weather section</div>
    <div class="tasks">
      <CreateTask class="tasks__create" />
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
const user = await useSupabaseAuthClient().auth.getUser();
</script>
