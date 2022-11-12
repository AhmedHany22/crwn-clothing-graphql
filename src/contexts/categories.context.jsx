import { createContext, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

export const CategoriesContext = createContext({ categoriesMap: {} });

const COLLECTINS = gql`
  # We can remove the title "GetCollection" its only for devs
  query GetCollection {
    collections {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

export const CategoriesProvider = ({ children }) => {
  const { loading, error, data } = useQuery(COLLECTINS);
  const [categoriesMap, setCategoriesMap] = useState({});
  console.log(data);

  useEffect(() => {
    if (data) {
      const { collections } = data;
      const collectionMap = collections.reduce((acc, collection) => {
        const { title, items } = collection;
        acc[title.toLowerCase()] = items;
        return acc;
      }, {});
      setCategoriesMap(collectionMap);
    }
  }, [data]);

  const value = { categoriesMap, loading };
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};
