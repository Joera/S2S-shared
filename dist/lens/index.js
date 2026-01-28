"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAuthorInfo = exports.updateToLens = exports.postToLens = void 0;
const metadata_1 = require("@lens-protocol/metadata");
const storage_client_1 = require("@lens-chain/storage-client");
const client_1 = require("@lens-protocol/client");
const metadata_2 = require("@lens-protocol/metadata");
const APP_ADDRESS = "0x984eB47F0A6E66bb81aC31c34157d1BAa4B10ae5";
const storageClient = storage_client_1.StorageClient.create();
const S2SContentFragment = (0, client_1.graphql)(`
    fragment S2SContent on S2SContent {
        content,
        locale,
        attributes {
            tags,
            parent,
            language,
            position,
            postType,
            creationDate,
            modifiedDate
        }
    }
  `, []);
const createPostMetadata = (user, item) => {
    return (0, metadata_2.textOnly)({
        content: item.encrypted, // Required readable content
        locale: item.language || "en",
        attributes: [
            {
                type: metadata_1.MetadataAttributeType.STRING,
                key: "parent",
                value: item.parent?.toString() || "0"
            },
            {
                type: metadata_1.MetadataAttributeType.STRING,
                key: "position",
                value: item.position || "0"
            },
            {
                type: metadata_1.MetadataAttributeType.STRING,
                key: "postType",
                value: item.postType || "post"
            },
            {
                type: metadata_1.MetadataAttributeType.NUMBER,
                key: "creationDate",
                value: item.creationDate?.toString()
            },
            {
                type: metadata_1.MetadataAttributeType.NUMBER,
                key: "modifiedDate",
                value: item.modifiedDate?.toString()
            },
            {
                type: metadata_1.MetadataAttributeType.STRING,
                key: "plainTextHash",
                value: item.plainTextHash || ""
            },
        ],
        tags: item.tags || ["unamore--web"]
    });
};
// USES oxo.lens
const postToLens = async (user, lens, item, publicationFeed) => {
    const metadata = createPostMetadata(user, item);
    console.log(metadata);
    const { uri: metadataUri } = await storageClient.uploadAsJson(metadata);
    return await lens.post(metadataUri, publicationFeed);
};
exports.postToLens = postToLens;
// USES oxo.lens
const updateToLens = async (user, lens, item, streamId) => {
    const metadata = createPostMetadata(user, item);
    const { uri: metadataUri } = await storageClient.uploadAsJson(metadata);
    return await lens.update(metadataUri, streamId);
};
exports.updateToLens = updateToLens;
const LENS_API = 'https://api-v2.lens.dev';
const GET_PUBLICATION_AUTHOR = `
  query GetPublicationAuthor($publicationId: PublicationId!) {
    publication(request: { forId: $publicationId }) {
      ... on Post {
        by {
          id
          handle {
            fullHandle
            localName
          }
          ownedBy {
            address
          }
          createdAt
        }
      }
      ... on Comment {
        by {
          id
          handle {
            fullHandle
            localName
          }
          ownedBy {
            address
          }
          createdAt
        }
      }
      ... on Quote {
        by {
          id
          handle {
            fullHandle
            localName
          }
          ownedBy {
            address
          }
          createdAt
        }
      }
    }
  }
`;
const fetchAuthorInfo = async (lensId) => {
    const authorResponse = await fetch(LENS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: GET_PUBLICATION_AUTHOR,
            variables: { publicationId: lensId }
        })
    });
    const { data } = await authorResponse.json();
    return {
        lens: data.publication.by.handle.fullHandle,
        address: data.publication.by.ownedBy.address,
        createdAt: data.publication.by.createdAt
    };
};
exports.fetchAuthorInfo = fetchAuthorInfo;
