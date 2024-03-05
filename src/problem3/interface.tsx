// defines wallet balance
interface WalletBalance {
    currency: string;
    amount: number;
}

// extends wallet balance interface with formatted string
interface FormattedWalletBalance extends WalletBalance{
    formatted: string;
}

// implement the datasource class so it can retrieve data
class Datasource {
    constructor(url) {
        this.url = url;
    }

    // specify the async function and await keyword
    // this pauses the function until the promise has been resolved
    async getPrices() {
        try {
            const response = await fetch(this.url);
            // if the api request fails, use the ok() method to implement
            // robust error handling with the appropriate error messages
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // extract data as json object from response
            const data = await response.json();
            return data;
        }
        // errors during fetch or parse are logged to console
        catch (error){
            console.error(error);
            // rethrow error
            throw error;
        }
    }
}

// extends box props from material ui library
// quite unsure how to implement this portion
interface Props extends BoxProps {

}

// wallet page component
const WalletPage: React.FC<Props> = (props: Props) => {
    // set initial load state to false
    const [isLoading, setIsLoading] = useState(false);
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const [prices, setPrices] = useState({});

    useEffect(() => {
        // set load state to true before data fetching begins
        setIsLoading(true);
        const datasource = new Datasource("https://interview.switcheo.com/prices.json");
        datasource.getPrices()
            .then(prices => setPrices(prices))
            .catch(error => console.error(error))
            // set load state to false after data fetching has been completed
            .finally(() => setIsLoading(false));
    }, []);

    const getPriority = (blockchain: any): number => {
        switch(blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            // both zilliqa and neo are assigned the same priority
            case 'Zilliqa':
            case 'Neo':
                return 20
            default:
                return -99
        }
    };

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // lhsPriority has not been defined
                // therefore replaced with balancePriority
                // nested if is simplified using the AND operator
                // returns true if both conditions are met otherwise false
                return balancePriority > -99 && balance.amount <= 0;
            }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);

                if (leftPriority > rightPriority) {
                    return -1;
                }
                else if (rightPriority > leftPriority) {
                    return 1;
                }
                // account for the possibility of both with equal priorities
                else {
                    return 0;
                }
            });
    }, [balances, prices]);

    // const formattedBalances = useMemo(() => {
    //     return sortedBalances.map((balance: WalletBalance) => ({
    //         ...balance,
    //         formatted: balance.amount.toFixed()
    //     }))
    // }, [sortedBalances]);

    // formattedBalances is declared but never read
    // hence balance.amount.toFixed() has been extracted
    // and utilised directly inside of rows mapping

    // implemented useMemo hook for mapping of
    // sortedBalances to WalletRow components

    // note: im relatively new to react hooks so code might not be fully understood
    const rows = useMemo(() => {
        return sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
            // extracted from formattedBalances
            const formattedAmount = balance.amount.toFixed();
            const usdValue = prices[balance.currency] * balance.amount;
            return (
                <WalletRow
                    key={index}
                    className={classes.row}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            )
        })
    }, [sortedBalances, prices]);

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}