<template>
  <div class="home">
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          <img src="@/assets/pictures.svg" alt="Cool Images: Free image portal" width="50" height="28">
          <span>Cool Images</span>
        </a>
        <!-- <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a> -->
      </div>
      <form>
        <div class="control has-icons-left">
          <input class="input is-rounded" placeholder="Search">
          <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </form>
    </nav>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="images-box">
            <div class="box-header">
              <div class="tabs is-medium">
                <ul>
                    <li @click="changeTab(tab)" :class="tab.active ? 'is-active' : ''" v-for="tab in photo_tabs" :key="tab.value">
                      <a>{{ tab.title }}</a>
                    </li>
                </ul>
              </div>
            </div>
            <div class="images">
              <div :style="{backgroundImage: 'url('+image.urls.regular +')'}" class="image-card" v-for="image in images" :key="image.id">
                <div class="img-details">
                  <div class="likes">
                    {{image.likes}} <img src="@/assets/like.svg" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div v-if="loadingImages" class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        </div>
      </div>
    </section>
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
      images: [],
      photo_tabs: [
        {
          title: 'Latest',
          value: 'latest',
          active: true
        },
        {
          title: 'Popular',
          value: 'popular',
          active: false
        }
      ],
      active_tab: null,
      page: 1,
      loadingImages: false
    }
  },
  created() {
  },
  mounted() {
    if (this.$route.query.tab) {
      this.setTab();
    } else {
      this.$router.push({ path: '/', query: { tab: 'latest' }});
    };
    this.scroll();
  },
  methods: {
    scroll() {
      window.onscroll = () => {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        this.page++;
        this.getPhotos(this.active_tab);
      }
    };
    },
    getPhotos(order_by) {
      this.loadingImages = true;
      HTTP.get('/photos', {
        params:{
          order_by,
          page: this.page,
          per_page: 15
        }
      })
      .then((res) => {
        this.images.push(...res.data);
        this.loadingImages = false;
      })
    },
    changeTab(tab) {
      this.$router.push({ path: '/', query: { tab: tab.value }});
    },
    setTab() {
      this.photo_tabs.map(tab=>{
          tab.active = this.$route.query.tab === tab.value;
      });
      this.active_tab = this.$route.query.tab;
      this.page = 1;
      this.images = [];
      this.getPhotos(this.active_tab);
    }
  },
  watch: {
  '$route' (to, from) {
    this.setTab();
  }
  }
};
</script>

<style scoped>
  div.home {
    width: 100%;
  }

  nav.navbar {
    width: 100%;
    padding: 5px 0;
  }

  a.navbar-item > span {
    font-weight: 600;
  }

  nav > form {
    align-self: center;
    flex-grow: 0.5;
    margin: 0 10px;
  }
  
  section.hero {
    margin-top: 4.5rem;
  }

  div.search-box {
    width: 100%;
    padding: 30px;
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