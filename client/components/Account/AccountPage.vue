<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <article class="container">
      <nav class="navbar">
        <header>
          <h2>Settings</h2>
        </header>
        <p
          :class="{selected: viewingTab ==='management'}"
          @click="setViewingTab('management')"
        >
          Account Management
        </p>
        <p
          :class="{selected: viewingTab ==='anb'}"
          @click="setViewingTab('anb')"
        >
          A New Beginning
        </p>
        <p
          :class="{selected: viewingTab ==='freetbin'}"
          @click="setViewingTab('freetbin')"
        >
          Freet Bin
        </p>
      </nav>
      <section class="content">
        <section
          v-if="viewingTab === 'management'"
        >
          <header>
            <h2>Account settings for @{{ $store.state.username }}</h2>
          </header>
          <ChangeUsernameForm />
          <ChangePasswordForm />
          <ChangeDisplayNameForm />
          <header>
            <h2>Account management</h2>
          </header>
          <LogoutForm />
          <DeleteAccountForm />
          <header>
            <h2>Account Privacy</h2>
          </header>
          <PrivatePage />
        </section>
        <section v-if="viewingTab === 'freetbin'">
          <FreetsBinPage />
        </section>
        <section v-if="viewingTab === 'anb'">
          <ANewBeginningPage />
        </section>
      </section>
    </article>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import ChangeDisplayNameForm from '@/components/Account/ChangeDisplayNameForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import PrivatePage from '@/components/Account/PrivatePage.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import ANewBeginningPage from '@/components/Account/ANewBeginningPage.vue';
import FreetsBinPage from '@/components/Freet/FreetsBinPage.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    ChangeDisplayNameForm,
    DeleteAccountForm,
    LogoutForm,
    PrivatePage,
    FreetsBinPage,
    ANewBeginningPage
  },
  data() {
    return {
      viewingTab : "management"
    }
  },
  methods: {
    setViewingTab(tab){
      this.viewingTab = tab;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 200px;
}
.navbar {
  margin-top: 5px;
  padding: 0px;
  font-family: Arial;
  width: 15%;
}
.navbar p{
  cursor: pointer;
}
.content {
  margin-top: 5px;
  padding: 0px;
  font-family: Arial;
  width: 45%;
}

.selected {
  color: #24b2e1;
  font-weight: bolder;
}
</style>