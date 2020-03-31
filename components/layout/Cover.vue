<template lang="html">
  <section>
    <section style="" class="">
      <Logo style="" id="pageLogo"/>
    </section>
    <section class="" style="text-align: center; margin-top: 4em;">
      <div class="">
        <h1>Welcome to frac.tools WebTemplate</h1>
      </div>
    </section>
  </section>
</template>

<script>
import Logo from '~/components/layout/Logo'

export default {
  components: {
    Logo
  }
}

</script>

<style lang="css" scoped>
#pageLogo {
  margin-left: 30%;
  margin-top: 10%;
}

/* .cover {
  background-image: url('../assets/content/cover/background.jpg');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
} */
</style>
