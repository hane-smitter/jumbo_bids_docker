import {
  CREATE,
  READALLPROD,
  READBIDDABLEPROD,
  READUNBIDDABLEPROD,
  CREATECAT,
  ERROR,
  LOADING,
  CREATEBID,
  READCAT,
  STATUS,
  READBIDS,
  READEXBIDS,
  READDASHDATA,
  READBIDWINNERS,
  READSTORES
} from "../constants";

const initState = {
  products: {
    allprod: [],
    biddableprod: [],
    unbiddableprod: [],
  },
  categories: [],
  bidproducts: [],
  bids: {
    allbids: [],
    exbids: []
  },
  bidwinners: [],
  dashData: {},
  stores:[],
  status: {},
  err: [],
  loading: false,
};

export default (app = initState, action) => {
  switch (action.type) {
    case READALLPROD:
      return {
        ...app,
        products: { ...app.products, allprod: action.payload.products },
      };
    case READBIDDABLEPROD:
      return {
        ...app,
        products: { ...app.products, biddableprod: action.payload.products },
      };
    case READUNBIDDABLEPROD:
      return {
        ...app,
        products: { ...app.products, unbiddableprod: action.payload.products },
      };
    case CREATE:
      return {
        ...app,
        products: [action.payload.product, ...app.products],
      };
    //categories
    case READCAT:
      return {
        ...app,
        categories: action.payload.categories,
      };
    case CREATEBID:
      return {
        ...app,
        bidproducts: [action.payload.productBid, ...app.bidproducts],
      };
    case CREATECAT:
      return {
        ...app,
        categories: [action.payload.category, ...app.categories],
      };
    case READBIDS:
      return {
        ...app,
        bids: { ...app.bids, allbids: action.payload.bids },
      };
    case READEXBIDS:
      return {
        ...app,
        bids: { ...app.bids, exbids: action.payload.bids },
      };
    case READDASHDATA:
      return {
        ...app,
        dashData: action.payload.dashData,
      };
    case STATUS:
      return {
        ...app,
        status: action.payload.status,
      };
    case READBIDWINNERS:
      return {
        ...app,
        bidwinners: action.payload.winners,
      };
    case READSTORES:
      return {
        ...app,
        stores:action.payload.stores,
      };
    case ERROR:
      return {
        ...app,
        err: [...action.payload.err],
      };
    case LOADING:
      return {
        ...app,
        loading: Boolean(action.payload.status),
      };
    default:
      return app;
  }
};
