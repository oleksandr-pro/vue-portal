import permission from '@/constants/permission'
const permissionMixin = {
  data () {
    return {
      permission: permission
    }
  },
  methods: {
    hasPermission (permission) {
      const has = this.$oAuth.hasPermission(permission)
      return has
    }
  }
}

export { permissionMixin }