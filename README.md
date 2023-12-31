# duffel-components-react-native

A react-native component library for Duffel components


<p float="left">
  <img src='images/screenshot1.jpg' width='250'>
  <img src='images/screenshot2.jpg' width='250'>
</p>

## Installation

```sh
npm install duffel-components-react-native
```

## Usage

```js
import { BaggageSelectionCard } from 'duffel-components-react-native';
import { Offer, Passenger } from 'duffel-components-react-native/lib/typescript/src/duffelTypes';
import { SelectedService} from 'duffel-components-react-native/lib/typescript/src/types';
```

```js

function BaggageSelection({
    offer, 
    passengers
}:{
    offer: Offer;
    passengers: Passenger[];
}) {
    const [services, setServices] = useState<SelectedService[]>([]);
    return (
        <>
            <BaggageSelectionCard
                lng="fr"
                offer={offer}
                passengers={passengers}
                selectedBaggageServices={services}
                setSelectedBaggageServices={setServices}
            />
        </>
    );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
