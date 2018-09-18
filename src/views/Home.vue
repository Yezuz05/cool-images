<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="logo">
      <img src="@/assets/main-logo.png" alt="" srcset="">
    </div>
    <div class="search-box">
      <div class="input-box">
        <i class="fas fa-2x fa-search"></i>
        <input type="text" name="" class="img-search" id="" placeholder="search for images">
      </div>
    </div>
    <div class="images-box">
      <div class="box-header">Popular Images</div>
      <div class="images">
        <div :style="{backgroundImage: 'url('+image.urls.regular +')'}" class="image-card" v-for="image in images" :key="image.id">
          <div class="img-details">
            <div class="likes">
              {{image.likes}} <img src="@/assets/like.svg" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import {HTTP} from '../http.js';

export default {
  name: "home",
  components: {},
  data() {
    return {
      images: null
    }
  },
  created() {
    HTTP.get('/photos', {
      params:{
        order_by: 'popular'
      }
    })
      .then((res) => {
        this.images = res.data;
      })
  },
  mounted() {
    this.scroll();
  },
  methods: {
    scroll() {
      window.onscroll = () => {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        console.log('Isale window lawa');
      }
    };
    }
  }
};
</script>

<style scoped>
  div.home {
    width: 100%;
    display: grid;
    grid-template-rows: .1fr .4fr auto;
    grid-row-gap: 20px;
    padding: 20 20px;
    justify-items: center;
  }

  .logo > img {
    width: 250px;
  }

  div.search-box {
    width: 100%;
    padding: 30px;
  }

  div.input-box {
    display: grid;
    grid-template-columns: 50px auto;
    height: 50px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #acacac;
    background-color: #fff;
  }

  .input-box .fas {
    place-self: center;
    color: #acacac;
  }

  .search-box input {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-left: 1px solid #acacac;
    font-size: 24px;
    text-indent: 5px;
    border: none;
  }

  .search-box input:focus {
    outline: none;  
  }

  div.images-box {
    width: 100%;
    display: grid;
    grid-row-gap: 20px;
    padding: 0 25px;
  }

  .box-header {
    font-size: 20px;
    font-weight: 500;
  }

  div.images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 30px;
    padding: 20px;
    grid-auto-rows: 200px;
  }

  div.image-card {
    height: 200px;
    border-radius: 5px;
    padding: 10px;
    background-position: center;
    background-size: cover;
    display: grid;
  }

  div.img-details {
    align-self: end;
    display: flex;
    justify-content: space-between;
  }

  .image-card img {
    width: 20px;
  }

  div.likes {
    color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 5px;
  }

</style>