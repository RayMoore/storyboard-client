<template>
  <div class="header-wrapper">
    <div class="header-nav display-only">
      <router-link
        to="/"
        class="navbar-brand nav-title"
        style="margin-left: 10px; font-weight: bold"
      >
        <img
          src="/static/logo.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
        />
        cokework
      </router-link>
      <div v-if="id && token" class="avatar-wrapper ml-auto">
        <span class="avatar-label">{{ $t("WELCOME") }}</span>
        <span class="avatar-label">{{ username }}</span>
        <avatar
          @click.native="goToStoryboard"
          :src="avatar"
          style="width: 40px; height: 40px; border-radius: 20px; cursor: pointer"
        />
      </div>
      <div v-else class="ml-auto" style="height: 100%">
        <div class="navbar-nav header-items" style="height: 100%">
          <div>
            <icon
              :name="computedLocaleIcon"
              style="width: 20px; height: 20px"
            />
          </div>
          <div class="header-item dropdown">
            <a
              class="nav-link-custom dropdown-toggle nav-title"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style="margin-left: 5px"
            >
              {{ $t("LANGUAGE") }}
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdownMenuLink"
              style="position: absolute; top: 5vh"
            >
              <a class="dropdown-item" @click="changeLocale('en-US')"
                >{{ $t("EN_US") }} {{ renderCurrentLocale("en-US") }}</a
              >
              <a class="dropdown-item" @click="changeLocale('zh-CN')"
                >{{ $t("ZH_CN") }} {{ renderCurrentLocale("zh-CN") }}</a
              >
            </div>
          </div>
          <div
            v-show="!isMobile"
            :class="`header-item ${computedActiveLink('register')}`"
          >
            <router-link class="nav-link-custom nav-title" to="/register">{{
              $t("REGISTER")
            }}</router-link>
          </div>
          <div v-show="!isMobile" class="header-seperator"></div>
          <div
            v-show="!isMobile"
            :class="`header-item ${computedActiveLink('login')}`"
          >
            <router-link class="nav-link-custom nav-title" to="/login">{{
              $t("LOGIN")
            }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import avatar from "@/components/avatar";
export default {
  components: {
    avatar
  },
  data() {
    return {
      activeItem: this.$route.path.split("/").pop()
    };
  },
  computed: {
    ...mapState("user", ["id", "token", "avatar", "username"]),
    isMobile() {
      let pathLastValue = this.$route.path.split("/").pop();
      return pathLastValue === "mobile" ? true : false;
    },
    computedActiveLink() {
      return function(item) {
        if (item === this.activeItem) return "nav-active";
        return "";
      };
    },
    computedLocaleIcon() {
      return this.$i18n.locale;
    }
  },
  methods: {
    changeLocale(localeId) {
      if (this.$i18n.locale !== localeId) {
        this.$i18n.locale = localeId;
      }
    },
    renderCurrentLocale(localeId) {
      if (this.$i18n.locale === localeId) {
        return "✓";
      }
    },
    goToStoryboard() {
      this.$router.replace("/storyboard");
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal) return (this.activeItem = newVal.path.split("/").pop());
    }
  }
};
</script>

<style lang="scss" scoped>
.header-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 5vh;
  min-height: 60px;
  width: 100%;
  min-width: 1024px;
  background-color: #090723;
  z-index: 1;
  .header-nav {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .header-items {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    .header-item {
      border: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      max-width: 100px;
      min-width: 60px;
      height: 100%;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  .header-seperator {
    width: 2px;
    height: 50%;
    background-color: gainsboro;
    border-radius: 1px;
  }
  .nav-title {
    color: whitesmoke;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .nav-active {
    font-weight: bold;
  }
}
a {
  cursor: pointer;
}
.avatar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  .avatar-label {
    color: whitesmoke;
    margin-right: 10px;
  }
}

.nav-link-custom {
  border: none;
}
</style>
