export default function ({ store, error, redirect }) {
  if (store.state.authUser && store.state.authUser.role === 'Administrator') {
  } else {
    redirect('/')
  }
}
