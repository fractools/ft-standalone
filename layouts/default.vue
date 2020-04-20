<template>
  <section>
    <section v-if="!$store.state.fetchReadyAll" id="notReadyContainer">
      <FingerprintSpinner id="fingerprintSpinner"/>
    </section>
    <div v-else>
      <nuxt />
    </div>
  </section>
</template>
<script>
import FingerprintSpinner from '~/components/layout/loadingIndicator/FingerprintSpinner'
import '../assets/style/multiselect_custom.css'

export default {
  components: {
    FingerprintSpinner
  }
}
</script>
<style>
body {
  background: #2e2e2e;
}
p {
  color: white;
  margin: 0;
}

@namespace url("http://www.w3.org/1999/xhtml");

:root{
  scrollbar-color: grey lightgrey !important;
  scrollbar-width: thin !important;
}

* {
  scrollbar-width: thin !important;
}

::-webkit-scrollbar {
    height: 8px;
    width: 8px;
    background: lightgrey;
}

::-webkit-scrollbar-thumb {
    background: grey;
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
}

::-webkit-scrollbar-corner {
    background: lightgrey;
}

.deleteIcon:hover {
  color: red;
}
.addIcon:hover {
  color: lightgreen;
}

#notReadyContainer {
  color: white;
  height: 150vh;
  overflow: hidden;
  background: #2e2e2e;
  padding-top:5em;
}

#fingerprintSpinner {
  display: inline-block;
  position: absolute;
  left: -375px;
  margin-left: 50%;
  margin-top: 4em;
  animation: 1s appear;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
