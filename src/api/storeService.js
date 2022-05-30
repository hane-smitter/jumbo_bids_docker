let store = localStorage;

const storeService = {
  get profile() {
    return JSON.parse(store.getItem("profile"));
  },
  set saveProfile(profile) {
    store.setItem("profile", JSON.stringify(profile));
  },
  get bidInView() {
    return JSON.parse(store.getItem("bidId"));
  },
  set saveBidInViewId(id) {
    store.setItem("bidId", JSON.stringify(id));
  },
  get productInView() {
    return JSON.parse(store.getItem("productId"));
  },
  set saveProductInViewId(id) {
    store.setItem("productId", JSON.stringify(id));
  },
  // if shoul load more products
  set ifLoadMore(status) {
    store.setItem("more", JSON.stringify(status));
  },
  get loadMore() {
    return JSON.parse(store.getItem("more"));
  },
};

export { storeService };
