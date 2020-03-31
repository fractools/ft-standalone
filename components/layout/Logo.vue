<template>
  <img src="~/assets/pictures/layout/logo.png" class="NuxtLogo">
</template>
<style>
.NuxtLogo {
  width: 40%;
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

@media screen and (max-width: 650px) {
  .NuxtLogo {
    width: 75%;
  }
}
</style>
