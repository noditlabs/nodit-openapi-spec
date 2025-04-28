import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

namespace Schemas {
  export const address: OpenAPIV3.SchemaObject = {
    type: "string",
    description: "An account address",
    pattern: Patterns.aptos.address.source,
  };

  export const fields: OpenAPIV3.SchemaObject = {
    type: "array",
    description: "“ associated with the struct",
    items: {
      type: "object",
      required: ["name", "type"],
      properties: {
        name: {
          type: "string",
        },
        type: {
          type: "string",
          description: "Type of the field",
          pattern: Patterns.aptos.primitiveType.source,
        },
      },
    },
  };

  export const generic_type_params: OpenAPIV3.SchemaObject = {
    type: "array",
    description: "Generic type parameters associated with the Move function",
    items: {
      type: "object",
      required: ["name", "constraints"],
      properties: {
        constraints: {
          type: "array",
          description:
            "Move abilities tied to the generic type param and associated with the function that uses it",
          items: {
            type: "string",
          },
        },
      },
    },
  };

  export const exposed_functions: OpenAPIV3.SchemaObject = {
    type: "array",
    description: "Public functions of the module",
    items: {
      type: "object",
      required: [
        "name",
        "visibility",
        "is_entry",
        "is_view",
        "params",
        "return",
      ],
      properties: {
        name: {
          type: "string",
        },
        visibility: {
          type: "string",
          description: "Move function visibility",
        },
        is_entry: {
          type: "boolean",
          description:
            "Whether the function can be called as an entry function directly in a transaction",
        },
        is_view: {
          type: "boolean",
          description: "Whether the function is a view function or not",
        },
        generic_type_params: generic_type_params,
        params: {
          type: "array",
          items: {
            type: "string",
            description: "Parameters associated with the Move function",
            pattern: Patterns.aptos.primitiveType.source,
          },
        },
        return: {
          type: "array",
          items: {
            type: "string",
            description: "Return type of the Move function",
            pattern: Patterns.aptos.primitiveType.source,
          },
        },
      },
    },
  };

  export const bytecode: OpenAPIV3.SchemaObject = {
    type: "string",
    description:
      "All bytes (Vec) data is represented as hex-encoded string prefixed with 0x and fulfilled with two hex digits per byte.",
    pattern: Patterns.string.hexaDecimal.source,
  };

  export const abi: OpenAPIV3.SchemaObject = {
    type: "object",
    description: "A Move module",
    required: ["address", "name", "friends", "exposed_functions", "“"],
    properties: {
      address: address,
      name: {
        type: "string",
      },
      friends: {
        type: "array",
        items: {
          type: "string",
          description: "Friends of the module",
        },
      },
      exposed_functions: exposed_functions,
      fields: fields,
    },
  };

  export const module: OpenAPIV3.SchemaObject = {
    type: "object",
    description: "A Move module",
    required: ["bytecode", "abi"],
    properties: {
      bytecode: bytecode,
      abi: abi,
    },
  };

  export namespace Payload {
    export const entryFunction: OpenAPIV3.SchemaObject = {
      title: "Entry Function Payload",
      type: "object",
      description: "The payload of the entry function",
      required: ["type", "function", "type_arguments", "arguments"],
      properties: {
        type: {
          type: "string",
          description: "The type of the payload",
          example: "entry_function_payload",
        },
        function: {
          type: "string",
          description: "The function of the payload",
        },
        type_arguments: {
          type: "array",
          description: "The type arguments of the payload",
          items: {
            type: "string",
            pattern: Patterns.aptos.primitiveType.source,
          },
        },
        arguments: {
          type: "array",
          description: "The arguments of the payload",
          items: {
            type: "string",
          },
        },
      },
    };

    export const script: OpenAPIV3.SchemaObject = {
      title: "Script Payload",
      type: "object",
      description: "The payload of the script",
      required: ["type", "code"],
      properties: {
        type: {
          type: "string",
          description: "The type of the payload",
          example: "script_payload",
        },
        code: {
          type: "object",
          description: "The code of the script",
          properties: {
            bytecode: bytecode,
            abi: exposed_functions,
          },
        },
      },
    };

    export const moduleBundle: OpenAPIV3.SchemaObject = {
      title: "Module Bundle Payload",
      type: "object",
      description: "The payload of the module bundle",
      required: ["type", "modules"],
      properties: {
        type: {
          type: "string",
          description: "The type of the payload",
          example: "module_bundle_payload",
        },
        modules: {
          type: "array",
          items: module,
        },
      },
    };

    export const multisig: OpenAPIV3.SchemaObject = {
      title: "Multisig Payload",
      type: "object",
      description: "The payload of the multisig",
      required: ["type", "transactionPayload"],
      properties: {
        type: {
          type: "string",
          description: "The type of the payload",
          example: "multisig_payload",
        },
        transactionPayload: Payload.entryFunction,
      },
    };
  }

  export namespace SignatureTypes {
    export const publicKey: OpenAPIV3.SchemaObject = {
      type: "string",
      description:
        "All bytes (Vec) data is represented as hex-encoded string prefixed with 0x and fulfilled with two hex digits per byte.",
      pattern: Patterns.string.hexaDecimal.source,
    };
    export const signature: OpenAPIV3.SchemaObject = {
      type: "string",
      description:
        "All bytes (Vec) data is represented as hex-encoded string prefixed with 0x and fulfilled with two hex digits per byte.",
      pattern: Patterns.string.hexaDecimal.source,
    };

    export const ed25519: OpenAPIV3.SchemaObject = {
      title: "Ed25519 Signature",
      type: "object",
      description: "The Ed25519 signature",
      required: ["type", "public_key", "signature"],
      properties: {
        type: {
          type: "string",
          description: "The type of the signature",
          example: "ed25519_signature",
        },
        public_key: publicKey,
        signature: signature,
      },
    };

    export const multiEd25519: OpenAPIV3.SchemaObject = {
      title: "Multi Ed25519 Signature",
      type: "object",
      description: "A Ed25519 multi-sig signature",
      required: ["type", "public_keys", "signatures", "threshold", "bitmap"],
      properties: {
        type: {
          type: "string",
          description: "The type of the signature",
          example: "multi_ed25519_signature",
        },
        public_keys: {
          type: "array",
          description: "The public keys for the Ed25519 signature",
          items: publicKey,
        },
        signatures: {
          type: "array",
          description:
            "Signature associated with the public keys in the same order",
          items: signature,
        },
        threshold: {
          type: "integer",
          description:
            "The number of signatures required for a successful transaction",
        },
        bitmap: {
          type: "string",
          description:
            "All bytes (Vec) data is represented as hex-encoded string prefixed with 0x and fulfilled with two hex digits per byte",
          pattern: Patterns.string.hexaDecimal.source,
        },
      },
    };
  }

  export namespace AccountSignature {
    export const ed25519: OpenAPIV3.SchemaObject = SignatureTypes.ed25519;
    export const multiEd25519: OpenAPIV3.SchemaObject =
      SignatureTypes.multiEd25519;

    export const singleKey: OpenAPIV3.SchemaObject = {
      title: "Single Key Signature",
      type: "object",
      description: "A single key signature",
      required: ["type", "public_key", "signature"],
      properties: {
        type: {
          type: "string",
          description: "The type of the signature",
          example: "single_key_signature",
        },
        public_key: SignatureTypes.publicKey,
        signature: SignatureTypes.signature,
      },
    };

    export const multiKey: OpenAPIV3.SchemaObject = {
      title: "Multi Key Signature",
      type: "object",
      description: "A multi-key signature",
      required: ["type", "public_keys", "signatures"],
      properties: {
        type: {
          type: "string",
          description: "The type of the signature",
          example: "multi_key_signature",
        },
        public_keys: {
          type: "array",
          description: "The public keys for the multi-key signature",
          items: SignatureTypes.publicKey,
        },
        signatures: {
          type: "array",
          description: "The signatures associated with the public keys",
          items: {
            type: "object",
            properties: {
              index: {
                type: "integer",
                description: "The index of the public key",
              },
              signature: SignatureTypes.signature,
              signatures_required: {
                type: "integer",
                description:
                  "The number of signatures required for a successful transaction",
              },
            },
          },
        },
      },
    };
  }

  export const secondarySigners: OpenAPIV3.SchemaObject = {
    type: "array",
    description: "The other involved parties' signatures",
    items: {
      type: "object",
      oneOf: [
        AccountSignature.ed25519,
        AccountSignature.multiEd25519,
        AccountSignature.singleKey,
        AccountSignature.multiKey,
      ],
    },
  };

  export namespace TransactionSignature {
    export const ed25519: OpenAPIV3.SchemaObject = SignatureTypes.ed25519;

    export const multiEd25519: OpenAPIV3.SchemaObject =
      SignatureTypes.multiEd25519;

    export const multiAgent: OpenAPIV3.SchemaObject = {
      title: "Multi Agent Signature",
      type: "object",
      description: "A multi-agent signature",
      required: ["type", "signatures"],
      properties: {
        type: {
          type: "string",
          description: "The type of the signature",
          example: "multi_agent_signature",
        },
        sender: {
          type: "object",
          description: "The sender's signature",
          oneOf: [
            AccountSignature.ed25519,
            AccountSignature.multiEd25519,
            AccountSignature.singleKey,
            AccountSignature.multiKey,
          ],
        },
        secondary_signer_addresses: {
          type: "array",
          description: "The other involved parties' addresses",
          items: {
            type: "string",
            pattern: Patterns.aptos.address.source,
          },
        },
        secondary_signers: secondarySigners,
      },
    };

    export const feePayer: OpenAPIV3.SchemaObject = {
      title: "Fee Payer Signature",
      type: "object",
      description: "The fee payer of the transaction",
      required: [
        "sender",
        "secondary_signer_addresses",
        "secondary_signers",
        "fee_payer_address",
        "fee_payer_signature",
      ],
      properties: {
        type: {
          type: "string",
          description: "The type of the signature",
          example: "fee_payer_signature",
        },
        sender: {
          type: "object",
          description: "The sender's signature",
          oneOf: [
            AccountSignature.ed25519,
            AccountSignature.multiEd25519,
            AccountSignature.singleKey,
            AccountSignature.multiKey,
          ],
        },
        secondary_signer_addresses: {
          type: "array",
          description: "The other involved parties' addresses",
          items: {
            type: "string",
            pattern: Patterns.aptos.address.source,
          },
        },
        secondary_signers: {
          type: "array",
          description: "The other involved parties' signatures",
          items: {
            type: "object",
            oneOf: [
              AccountSignature.ed25519,
              AccountSignature.multiEd25519,
              AccountSignature.singleKey,
              AccountSignature.multiKey,
            ],
          },
        },
        fee_payer_address: {
          type: "string",
          description: "The address of the paying party",
          pattern: Patterns.aptos.address.source,
        },
        fee_payer_signature: {
          type: "object",
          description: "The signature of the fee payer",
          oneOf: [
            AccountSignature.ed25519,
            AccountSignature.multiEd25519,
            AccountSignature.singleKey,
            AccountSignature.multiKey,
          ],
        },
      },
    };

    export const account: OpenAPIV3.SchemaObject = {
      title: "Account Signature",
      type: "object",
      description: "The signature of the transaction",
      oneOf: [
        AccountSignature.ed25519,
        AccountSignature.multiEd25519,
        AccountSignature.singleKey,
        AccountSignature.multiKey,
      ],
    };
  }

  export const event: OpenAPIV3.SchemaObject = {
    type: "object",
    properties: {
      guid: {
        type: "object",
        properties: {
          creation_number: {
            type: "string",
            pattern: Patterns.string.uint64.source,
            description: "The creation number of the event",
          },
          account_address: {
            type: "string",
            description: "The account address of the event",
          },
        },
      },
      sequenceNumber: {
        type: "string",
        pattern: Patterns.string.uint64.source,
        description: "The sequence number of the event",
      },
      type: {
        type: "string",
        description: "The type of the event",
      },
      data: {
        type: "object",
        description: "The data of the event",
      },
    },
  };

  export const sequenceNumber: OpenAPIV3.SchemaObject = {
    type: "integer",
    pattern: Patterns.string.uint64.source,
    description: "A string containing a 64-bit unsigned integer.",
    example: 32425224034,
  };

  export namespace TransactionTypes {
    export const TransactionMetadata: OpenAPIV3.SchemaObject = {
      type: "object",
      required: [
        "sender",
        "sequence_number",
        "max_gas_amount",
        "gas_unit_price",
        "expiration_timestamp_secs",
        "payload",
        "signature",
      ],
      properties: {
        sender: {
          type: "string",
          description:
            "The sender of the transaction. The format is a hex encoded 32 byte aptos account address.",
        },
        sequence_number: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description:
            "The sequence number of the transaction. The format is a 64-bit unsigned integer.",
        },
        max_gas_amount: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description:
            "The maximum gas amount of the transaction. The format is a 64-bit unsigned integer.",
        },
        gas_unit_price: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description:
            "The gas unit price of the transaction. The format is a 64-bit unsigned integer.",
        },
        expiration_timestamp_secs: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description:
            "The expiration timestamp of the transaction. The format is a 64-bit unsigned integer.",
        },
        payload: {
          type: "object",
          oneOf: [
            Payload.entryFunction,
            Payload.script,
            Payload.moduleBundle,
            Payload.multisig,
          ],
        },
        signature: {
          type: "object",
          description: "The signature of the transaction",
          oneOf: [
            TransactionSignature.ed25519,
            TransactionSignature.multiEd25519,
            TransactionSignature.multiAgent,
            TransactionSignature.feePayer,
            TransactionSignature.account,
          ],
        },
      },
    };

    export const TransactionOutcomeDetails: OpenAPIV3.SchemaObject = {
      type: "object",
      required: [
        "version",
        "hash",
        "state_change_hash",
        "event_root_hash",
        "state_checkpoint_hash",
        "gas_used",
        "success",
        "vm_status",
        "accumulator_root_hash",
        "changes",
      ],
      properties: {
        version: {
          type: "string",
          description: "The version of the transaction",
        },
        hash: {
          type: "string",
          description: "The hash of the transaction",
        },
        state_change_hash: {
          type: "string",
          description: "The state change hash of the transaction",
        },
        event_root_hash: {
          type: "string",
          description: "The event root hash of the transaction",
        },
        state_checkpoint_hash: {
          type: "string",
          description: "The state checkpoint hash of the transaction",
        },
        accumulator_root_hash: {
          type: "string",
          description: "The accumulator root hash of the transaction",
        },
        gas_used: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description: "The gas used by the transaction",
        },
        success: {
          type: "boolean",
          description: "The success of the transaction",
        },
        vm_status: {
          type: "string",
          description:
            "The VM status of the transaction, can tell useful information in a failure",
        },
        changes: {
          type: "array",
          description: "The changes of the transaction",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "The type of the change",
              },
              address: address,
              state_key_hash: {
                type: "string",
                description: "The state key hash.",
              },
              module: {
                type: "string",
                description:
                  "Move module id is a string representation of Move module.",
              },
            },
          },
        },
      },
    };

    export const pendingTransaction: OpenAPIV3.SchemaObject = {
      title: "Pending Transaction",
      type: "object",
      description: "A transaction",
      required: ["type", "hash", ...TransactionMetadata.required!],
      properties: {
        hash: {
          type: "string",
          description: "The hash of the transaction",
        },
        ...TransactionMetadata.properties,
      },
    };

    export const userTransaction: OpenAPIV3.SchemaObject = {
      title: "User Transaction",
      type: "object",
      description: "A user transaction",
      required: [
        ...TransactionOutcomeDetails.required!,
        ...TransactionMetadata.required!,
        "events",
        "timestamp",
      ],
      properties: {
        ...TransactionOutcomeDetails.properties,
        ...TransactionMetadata.properties,
        events: {
          type: "array",
          description: "The events of the transaction",
          items: event,
        },
        timestamp: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description: "The timestamp of the transaction",
        },
      },
    };

    export const genesisTransaction: OpenAPIV3.SchemaObject = {
      title: "Genesis Transaction",
      type: "object",
      description: "A genesis transaction",
      required: [...TransactionOutcomeDetails.required!, "events", "payload"],
      properties: {
        ...TransactionOutcomeDetails.properties,
        payload: {
          type: "object",
          description:
            "A write set payload, used only for genesis transactions",
          properties: {
            type: {
              type: "string",
              description: "The type of the payload",
              example: "write_set_payload",
            },
            write_set: {
              type: "object",
              description: "The write set of the transaction",
            },
          },
        },
        events: {
          type: "array",
          description: "The events of the transaction",
          items: event,
        },
      },
    };

    export const blockMetadataTransaction: OpenAPIV3.SchemaObject = {
      title: "Block Metadata Transaction",
      type: "object",
      required: [
        ...TransactionOutcomeDetails.required!,
        "events",
        "id",
        "epoch",
        "round",
        "previous_block_votes_bitvec",
        "proposer",
        "failed_proposer_indices",
        "timestamp",
      ],
      properties: {
        ...TransactionOutcomeDetails.properties,
        id: {
          type: "string",
          description: "The ID of the transaction",
        },
        epoch: {
          type: "string",
          description: "The epoch of the transaction",
        },
        round: {
          type: "string",
          description: "The round of the transaction",
        },
        events: {
          type: "array",
          description: "The events of the transaction",
          items: event,
        },
        previous_block_votes_bitvec: {
          type: "string",
          description: "The previous block votes bitvec",
        },
        proposer: {
          type: "string",
          description: "The proposer of the transaction",
        },
        failed_proposer_indices: {
          type: "array",
          description: "The failed proposer indices",
          items: {
            type: "string",
          },
        },
        timestamp: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description: "The timestamp of the transaction",
        },
      },
    };

    export const stateCheckpointTransaction: OpenAPIV3.SchemaObject = {
      title: "State Checkpoint Transaction",
      type: "object",
      required: [...TransactionOutcomeDetails.required!, "timestamp"],
      properties: {
        ...TransactionOutcomeDetails.properties,
        timestamp: {
          type: "string",
          pattern: Patterns.string.uint64.source,
          description: "The timestamp of the transaction",
        },
      },
    };
  }

  export const transaction: OpenAPIV3.SchemaObject = {
    type: "object",
    oneOf: [
      TransactionTypes.pendingTransaction,
      TransactionTypes.userTransaction,
      TransactionTypes.genesisTransaction,
      TransactionTypes.blockMetadataTransaction,
      TransactionTypes.stateCheckpointTransaction,
    ],
  };

  export const authenticationKey: OpenAPIV3.SchemaObject = {
    type: "string",
    description:
      "All bytes (Vec) data is represented as hex-encoded string prefixed with 0x and fulfilled with two hex digits per byte. Unlike the Address type, HexEncodedBytes will not trim any zeros.",
    pattern: Patterns.string.hexaDecimal.source,
    example:
      "0x88fbd33f54e1126269769780feb24480428179f552e2313fbe571b72e62a1ca1",
  };

  export const resource: OpenAPIV3.SchemaObject = {
    type: "object",
    description: "A resource of the account",
    required: ["type", "data"],
    properties: {
      type: {
        type: "string",
        description: `String representation of a MoveStructTag (on-chain Move struct type). This exists so you can specify MoveStructTags as path / query parameters, e.g. for get_events_by_event_handle.
		
		It is a combination of:
		
		1. move_module_address, module_name and struct_name, all joined by ::
		2. struct generic type parameters joined by ,
		
		Examples:
		
		- 0x1::coin::CoinStore<0x1::aptos_coin::aptosCoin>
		- 0x1::account::Account`,
        pattern: Patterns.aptos.resourceType.source,
      },
      data: {
        type: "object",
        description:
          "This is a JSON representation of some data within an account resource. More specifically, it is a map of strings to arbitrary JSON values / objects, where the keys are top level fields within the given resource.",
      },
    },
  };

  export const struct: OpenAPIV3.SchemaObject = {
    type: "object",
    description: "Structs of the module",
    required: ["name", "is_native", "abilities", "generic_type_params"],
    properties: {
      name: {
        type: "string",
      },
      is_native: {
        type: "boolean",
        description: "Whether the struct is a native struct of Move",
      },
      abilities: {
        type: "array",
        description: "Abilities associated with the struct",
        items: {
          type: "string",
        },
      },
      generic_type_params: generic_type_params,
    },
  };

  export const block: OpenAPIV3.SchemaObject = {
    type: "object",
    description:
      "This contains the information about a transactions along with associated transactions if requested",
    required: [
      "block_height",
      "block_hash",
      "block_timestamp",
      "first_version",
      "last_version",
    ],
    properties: {
      block_height: {
        type: "string",
        pattern: Patterns.string.uint64.source,
        description:
          "The height of the block. The format is a 64-bit unsigned integer.",
      },
      block_hash: {
        type: "string",
        description: "The hash of the block",
      },
      block_timestamp: {
        type: "string",
        pattern: Patterns.string.uint64.source,
        description:
          "The timestamp of the block. The format is a 64-bit unsigned integer.",
      },
      first_version: {
        type: "string",
        pattern: Patterns.string.uint64.source,
        description:
          "The first version of the block. The format is a 64-bit unsigned integer.",
      },
      last_version: {
        type: "string",
        pattern: Patterns.string.uint64.source,
        description:
          "The last version of the block. The format is a 64-bit unsigned integer.",
      },
      transactions: {
        type: "array",
        description: "The transactions in the block.",
        items: transaction,
      },
    },
  };

  export const ledgerInfo: OpenAPIV3.SchemaObject = {
    type: "object",
    properties: {
      chainId: {
        type: "integer",
        description: "Chain ID of the current chain",
      },
      epoch: {
        type: "string",
        description: "The epoch",
        pattern: Patterns.string.uint64.source,
      },
      ledgerVersion: {
        type: "string",
        description: "The ledger version",
        pattern: Patterns.string.uint64.source,
      },
      oldestLedgerVersion: {
        type: "string",
        description: "The oldest ledger version",
        pattern: Patterns.string.uint64.source,
      },
      ledgerTimestamp: {
        type: "string",
        description: "The ledger timestamp",
        pattern: Patterns.string.uint64.source,
      },
      nodeRole: {
        type: "string",
        description: "The node role",
        enum: ["full_node", "validator"],
      },
      oldestBlockHeight: {
        type: "string",
        description: "The oldest block height",
        pattern: Patterns.string.uint64.source,
      },
      blockHeight: {
        type: "string",
        description: "The block height",
        pattern: Patterns.string.uint64.source,
      },
      gitHash: {
        type: "string",
        description:
          "Git hash of the build of the API endpoint. Can be used to determine the exact software version used by the API endpoint.",
      },
    },
  };

  export const error: OpenAPIV3.SchemaObject = {
    type: "object",
    required: ["message", "error_code"],
    properties: {
      message: {
        type: "string",
      },
      error_code: {
        type: "string",
        description: `These codes provide more granular error information beyond just the HTTP status code of the response.

Allowed values: account_not_found, resource_not_found, module_not_found, struct_field_not_found, version_not_found, transaction_not_found, table_item_not_found, block_not_found, state_value_not_found, version_pruned, block_pruned, invalid_input, invalid_transaction_update, sequence_number_too_old, vm_error, health_check_failed, mempool_is_full, internal_error, web_framework_error, bcs_not_supported, api_disabled`,
      },
      vm_error_code: {
        type: "integer",
        description:
          "A code providing VM error details when submitting transactions to the VM.",
      },
    },
  };

  export const transactionFailures: OpenAPIV3.SchemaObject = {
    title: "Transaction Failures",
    type: "array",
    description: "The failures of the transaction",
    required: ["error", "transaction_index"],
    items: {
      type: "object",
      properties: {
        error: error,
        transaction_index: {
          type: "integer",
          description: "The index of the transaction",
        },
      },
    },
  };

  export const gasEstimateObject: OpenAPIV3.SchemaObject = {
    type: "object",
    required: ["gas_estimate"],
    properties: {
      deprioritized_gas_estimate: {
        type: "integer",
        description: "The deprioritized estimate for the gas unit price",
      },
      gas_estimate: {
        type: "integer",
        description: "The current estimate for the gas unit price",
      },
      prioritized_gas_estimate: {
        type: "integer",
        description: "The prioritized estimate for the gas unit price",
      },
    },
  };
}

export default Schemas;
