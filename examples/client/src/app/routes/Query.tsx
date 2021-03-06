import * as IotaAreaCodes from "@iota/area-codes";
import { Button, Fieldset, Form, FormStatus, Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { ServiceFactory } from "../../factories/serviceFactory";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ConfigurationService } from "../../services/configurationService";
import { QueryClient } from "../../services/queryClient";
import IACMap from "../components/IACMap";
import IACTransactionCard from "../components/IACTransactionCard";
import "./Conversion.scss";
import { QueryState } from "./QueryState";

/**
 * Component which will show conversions with IACs.
 */
class Query extends Component<any, QueryState> {
    /**
     * The configuration.
     */
    private readonly _configuration: IConfiguration;

    /**
     * The query client.
     */
    private readonly _queryClient: QueryClient;

    /**
     * Create a new instance of Conversion.
     * @param props The props.
     */
    constructor(props: any) {
        super(props);

        this._configuration = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._queryClient = new QueryClient(this._configuration.queryEndpoint);

        this.state = {
            isBusy: false,
            isErrored: false,
            status: "",
            userIotaAreaCode: ""
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={1}>Query</Heading>
                <p>Enter a partial IOTA Area Code to search the database for transactions.<br />
                    The code should be 9 characters long and end in a AA9. To have a wildcard for any other part of the location use padding character pairs of AA.<br />
                    Example queries could be NPAAAAAA9 or NPHTAAAA9.<br />
                    Transactions may not appear immediately after they have been created, as they take time to propagate from the attaching Node to the ZMQ Node.</p>
                <Form>
                    <Fieldset>
                        <label>IOTA Area Code</label>
                        <input
                            type="text"
                            placeholder="Enter partial, 9 Tryte IAC ie. NPHTAAAA9"
                            value={this.state.userIotaAreaCode}
                            onChange={e =>
                                this.setState({ userIotaAreaCode: e.target.value }, () =>
                                    this.validateIotaAreaCode()
                                )
                            }
                        />
                        <Button
                            disabled={!this.state.userIotaAreaCodeIsValid}
                            onClick={async () => this.query()}
                        >
                            Query
                        </Button>
                    </Fieldset>
                    <FormStatus
                        message={this.state.status}
                        isBusy={this.state.isBusy}
                        isError={this.state.isErrored}
                    />
                    {this.state.iacTransactions !== undefined && (
                        <div>
                            <React.Fragment>
                                <hr />
                                <Heading level={1}>Map</Heading>
                                {this.state.iacTransactions.length > 0 && (
                                    <IACMap
                                        query={this.state.userIotaAreaCode}
                                        iacTransactions={this.state.iacTransactions}
                                    />
                                )}
                            </React.Fragment>
                            <React.Fragment>
                                <hr />
                                <Heading level={1}>Transactions</Heading>
                                {this.state.iacTransactions.length === 0 && (
                                    <p>
                                        There are no IAC transactions within the specified area.
                                    </p>
                                )}
                                {this.state.iacTransactions.length > 0 &&
                                    this.state.iacTransactions.map(item => (
                                        <IACTransactionCard
                                            key={item.tx_id}
                                            iotaAreaCode={item.iac}
                                            transactionHash={item.tx_id}
                                        />
                                    ))}
                            </React.Fragment>
                        </div>
                    )}
                </Form>
                <hr />
                <p>For further information on how this code is implemeted visit the GitHub Repository for
                    the main library [<a href="https://github.com/iotaledger/iota-area-codes" target="_blank" rel="noreferrer noopener">@iota/area-codes</a>]
                    , the web app [<a href="https://github.com/iotaledger/iota-area-codes/tree/master/examples/client" target="_blank" rel="noreferrer noopener">Client</a>]
                    or the server [<a href="https://github.com/iotaledger/iota-area-codes/tree/master/examples/queryServer" target="_blank" rel="noreferrer noopener">Query Server</a>]
                </p>
            </React.Fragment>
        );
    }

    /**
     * Validate the iota area code using the library.
     */
    private validateIotaAreaCode(): void {
        let isValid = false;
        try {
            if (this.state.userIotaAreaCode) {
                isValid = IotaAreaCodes.isValidPartial(this.state.userIotaAreaCode);
            }
        } catch (err) { }
        this.setState({ userIotaAreaCodeIsValid: isValid });
    }

    /**
     * Search the api for transactions.
     */
    private async query(): Promise<void> {
        this.setState(
            {
                isBusy: true,
                isErrored: false,
                status: "Querying transactions, please wait..."
            },
            async () => {
                const response = await this._queryClient.query({
                    iac: this.state.userIotaAreaCode
                });

                if (response.success) {
                    this.setState({
                        isBusy: false,
                        status: "",
                        isErrored: false,
                        iacTransactions: response.items
                    });
                } else {
                    this.setState({
                        isBusy: false,
                        status: response.message,
                        isErrored: true
                    });
                }
            }
        );
    }
}

export default Query;
