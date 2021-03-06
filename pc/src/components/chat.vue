<template>
  <div
    v-if="to !== null"
    class="chat-wrapper"
    @click.stop="resetVisibleComponents"
  >
    <div class="chat">
      <div class="chat-user">
        <div class="chat-user-avatar-wrapper">
          <avatar
            class="chat-user-avatar"
            :user-id="to['_id']"
            :src="to['avatar']"
          />
        </div>
        <div class="chat-user-meta">
          <div class="chat-user-label">
            <icon
              v-if="to['gender'] === 'm'"
              name="male"
              style="color: cornflowerblue"
            />
            <icon v-else name="female" style="color: lightpink" />
            <online-status
              style="margin-left: 5px"
              :status="computedUserOnline"
            />
          </div>
          <div class="chat-user-name">
            <span>{{ to["username"] }}</span>
          </div>
        </div>
      </div>
      <div class="chat-body">
        <vue-scroll :ops="ops">
          <chat-message
            v-for="(message, index) in computedMessages"
            :key="index"
            :message="message"
          />
        </vue-scroll>
        <div class="chat-input">
          <chat-input ref="chat-input" @send-message="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueScroll from "vuescroll";
import avatar from "@/components/avatar";
import onlineStatus from "@/components/onlineStatus";
import chatInput from "@/components/chatInput";
import chatMessage from "@/components/chatMessage";
import { stopPropagation, mouseclick } from "@/common/utils/mouse";
import { eventBus } from "@/common/utils/eventBus";
import { mapState, mapMutations } from "vuex";
import * as URL from "@/common/utils/url";
import { createMessage } from "@/common/utils/message";

export default {
  components: {
    vueScroll,
    avatar,
    onlineStatus,
    chatInput,
    chatMessage
  },
  props: {
    to: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      ops: {
        vuescroll: {
          mode: "native"
        },
        scrollPanel: {
          scrollingX: false
        },
        bar: {
          background: "lightgrey"
        }
      },
      onlineStatus: false
    };
  },
  computed: {
    ...mapState("user", [
      "id",
      "token",
      "avatar",
      "gender",
      "username",
      "socket"
    ]),
    ...mapState("message", ["messages", "pendingMessages", "failedMessages"]),
    ...mapState("project", ["globalProjectMembers"]),
    computedMessages() {
      const { messages, to } = this;
      if (!to || !messages) return [];
      if (messages[to["_id"]]) return messages[to["_id"]]["messages"];
      return [];
    },
    computedUserOnline() {
      const { globalProjectMembers, to } = this;
      if (!to || !globalProjectMembers) return false;
      const userId = to["_id"];
      const userOnline =
        typeof globalProjectMembers[userId] === "undefined"
          ? false
          : globalProjectMembers[userId];
      return userOnline;
    }
  },
  methods: {
    ...mapMutations({
      save_message: "message/save_message",
      append_message: "message/append_message",
      add_pending: "message/add_pending",
      remove_pending: "message/remove_pending",
      add_failed: "message/add_failed",
      remove_failed: "message/remove_failed",
      mark_read: "message/mark_read"
    }),
    mouseclick,
    stopPropagation,
    show() {
      if (!this.visible) {
        this.visible = true;
      }
    },
    hide() {
      if (this.visible) {
        this.visible = false;
      }
    },
    resetVisibleComponents() {
      return eventBus.$emit("reset-visible-component");
    },
    sendMessage(val) {
      const { socket, id, to, gender, avatar, username } = this;
      if (!socket)
        return this.$alert.show({
          type: "warning",
          message: this.$t("SEND_MESSAGE_ERROR"),
          interval: 5000
        });
      const chatInputEl = this.$refs["chat-input"];
      if (chatInputEl && chatInputEl.resetMessage) chatInputEl.resetMessage();
      const data = createMessage(
        "chat",
        val,
        { _id: id, gender, avatar, username },
        to
      );
      this.add_pending(data._id);
      this.append_message(data);
      this.save_message();
      socket.emit("send-message", data, ack => {
        console.log(ack);
        if (!ack) this.add_failed(data._id);
        this.remove_pending(data._id);
        this.save_message();
      });
    }
  },
  watch: {
    messages: {
      deep: true,
      handler: function(newValue, oldValue) {
        let newJson = JSON.stringify(newValue);
        let oldJson = JSON.stringify(oldValue);
        if (newJson !== oldJson) {
          console.log("message changed");
          const { to } = this;
          if (!to || !to["_id"]) return;
          this.mark_read(to["_id"]);
          this.save_message();
        }
      }
    },
    to(newVal, oldVal) {
      if (!newVal) return;
      if (!newVal["_id"]) return;
      this.mark_read(newVal["_id"]);
      this.save_message();
    }
  }
};
</script>

<style lang="scss" scoped>
.chat-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .chat-user {
    width: 100%;
    height: 10%;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px gainsboro solid;
    .chat-user-avatar-wrapper {
      height: 100%;
      width: 20%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
    .chat-user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }
    .chat-user-meta {
      width: calc(100% - 50px);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .chat-user-label {
      width: 100%;
      height: 25%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
    .chat-user-name {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;
      height: 25%;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        white-space: nowrap;
        width: 95%;
      }
    }
  }
  .chat-body {
    width: 100%;
    height: 90%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: #f5f5f580;
  }
}
.chat-input {
  position: absolute;
  bottom: 0;
  border-top: 0.2px lightgrey solid;
  padding: 15px 0px 15px 5px;
  width: 100%;
  background-color: whitesmoke;
}
</style>
