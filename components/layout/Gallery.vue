<template>
  <section>
    <div class="flexContainer">
      <div class="image"
           v-for="(image, imageIndex) in images"
           :key="imageIndex"
           @click="index = imageIndex"
           :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }">
      </div>
    </div>
    <v-gallery :images="images"
               :index="index"
               @close="index = null" />
  </section>
</template>

<script>
export default {
  props: {
    images: Array
  },
  data() {
    return {
      index: null
    }
  }
}
</script>

<style>
.flexContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
}
</style>
