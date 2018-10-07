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
        <div class="control has-icons-left" :class="{'is-loading':isSearching }">
          <input class="input is-rounded" @keyup="searchBarType($event)" placeholder="Search" v-model="searchTerm">
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
              <div v-if="!hasSearched" class="tabs is-medium">
                <ul>
                    <li @click="changeTab(tab)" :class="tab.active ? 'is-active' : ''" v-for="tab in photo_tabs" :key="tab.value">
                      <a>{{ tab.title }}</a>
                    </li>
                </ul>
              </div>
              <div v-if="hasSearched" class="tabs is-medium search-tabs">
                <ul>
                    <li class="is-active">
                      <a>Search results for "{{ searchTerm }}"</a>
                    </li>
                    <li>
                      <div class="clear" @click="clearSearch()">
                        <i class="fas fa-times"></i> Clear search
                      </div>
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
import _ from 'lodash';
// import Form from '../form.js';

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
      loadingImages: false,
      searchTerm: null,
      isSearching: false,
      hasSearched: false,
      searchForm: new Form({
        name: []
      })
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
    window.onscroll = () => {
      this.scroll();
    };
  },
  methods: {
    scroll: _.debounce(function() {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
      if (bottomOfWindow) {
        this.page++;
        if (this.hasSearched) {
          this.search();
        } else {
          this.getPhotos(this.active_tab);
        }
      }
    }, 600),
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
    },
    searchBarType: _.debounce(function(e) {
      console.log(e.which);
      if (e.key.length !== 1 && e.key !== 'Backspace') {
        return;
      }
      this.search();
      this.images = [];
      window.scrollTo(0, 0);
    }, 700),
    search() {
      this.isSearching = true;
      this.loadingImages = true;
      if (!this.hasSearched) {
        this.images = [];
        this.page = 1;
        this.hasSearched = true;
      }
      HTTP.get('/search/photos', {
        params: {
          query: this.searchTerm,
          page: this.page,
          per_page: 15
        }
      })
      .then((res) => {
        this.images.push(...res.data.results);
        this.isSearching = false;
        this.loadingImages = false;
      })
    },
    clearSearch() {
      this.isSearching = false;
      this.loadingImages = false;
      this.images = [];
      this.hasSearched = false;
      this.searchTerm = null;
      this.setTab();
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

  .tabs li:not(.is-active) a:hover {
    color: #acacac;
  }

  /* .search-tabs li:not(.is-active) {
    align-self: baseline;
  } */

  div.clear {
    color: red;
    font-size: 10px;
    cursor: pointer;
  }
</style>