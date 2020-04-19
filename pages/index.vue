<template>
  <section id="pageContent">
    <Cover/>
  </section>
</template>

<script>
import Cover from '~/components/layout/Cover'
import Gallery from '~/components/layout/Gallery'

export default {
  components: {
    Cover
  },
  data() {
    return {
    }
  }
}
</script>

<style>
@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
#pageContent {
  animation: 0.5s appear;
}

.pageContainer {
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  color: white;
  padding: 1em;
}
@media screen and (max-width: 650px) {
  .pageContainer {
    padding: 0.25em;
  }
  #pageLogo {
    margin-left: 12.5%;
  }
}
</style>
