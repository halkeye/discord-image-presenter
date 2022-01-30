<template>
  <div class="notification is-danger">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'DangerNotification',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>
