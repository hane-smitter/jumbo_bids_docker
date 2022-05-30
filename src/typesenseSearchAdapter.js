import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
// import instantsearch from "instantsearch.js";
// import {
// 	InstantSearch
// } from "react-instantsearch-dom";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
	server: {
		apiKey: process.env.REACT_APP_TYPESENSE_API_KEY, // Be sure to use the search-only-api-key
		nodes: [
			{
				host: process.env.REACT_APP_TYPESENSE_CLOUD_HOST || "localhost",
				port: process.env.REACT_APP_TYPESENSE_CLOUD_PORT || "8108",
				protocol: process.env.REACT_APP_TYPESENSE_CLOUD_PROTOCOL || "http"
			}
		]
	},
	// The following parameters are directly passed to Typesense's search API endpoint.
	//  So you can pass any parameters supported by the search endpoint below.
	//  queryBy is required.
	additionalSearchParameters: {
		query_by: "name,category,cat_desc"
	}
});
export const searchClient = typesenseInstantsearchAdapter.searchClient;

// export default function main() {
// 	const search = InstantSearch({
// 		searchClient,
// 		indexName: "biddable_products"
// 	});

// 	search.addWidgets([
// 		searchBox({
// 			container: "#searchbox"
// 		}),
// 		configure({
// 			hitsPerPage: 8
// 		}),
// 		hits({
// 			container: "#hits",
// 			templates: {
// 				item(item) {
// 					return `
//           <div>
//             <img src="${item.image}" alt="${item.name}" height="100" />
//             <div class="hit-name">
//               ${item._highlightResult.name.value}
//             </div>
//             <div class="hit-authors">
//             // ${item._highlightResult.authors.map(a => a.value).join(", ")}
//             ${item._highlightResult.category.value}
//             </div>
//             <div class="hit-publication-year">${item.bidPrice}</div>
//             <div class="hit-rating">${item.bidPrice}/5 rating</div>
//           </div>
//         `;
// 				}
// 			}
// 		}),
// 		pagination({
// 			container: "#pagination"
// 		})
// 	]);
// }

// // search.start();
