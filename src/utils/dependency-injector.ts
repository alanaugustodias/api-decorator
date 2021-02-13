type DependencyInjection = { identifier: symbol; service: any };

class DependencyInjector {
    private services: DependencyInjection[];
    constructor() {
        this.services = [];
    }

    /**
     * Add a new instance of a class into the DI singleton
     * @param dependencyInjection
     */
    public add({ identifier, service }: DependencyInjection): void {
        if (!this.get(identifier)) {
            const serviceInstance = new service();
            this.services.push({
                identifier,
                service: serviceInstance
            });
        }
    }

    /**
     * Get a service instance from DI singleton
     * @param serviceIdentifier
     */
    public get(serviceIdentifier: symbol): DependencyInjection | undefined {
        return this.services.find(({ identifier }) => identifier === serviceIdentifier);
    }
}

const DependencyInjectorInstance = new DependencyInjector();
export default DependencyInjectorInstance;
