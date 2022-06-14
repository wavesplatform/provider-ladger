import isNil from 'ramda/es/isNil';

class StorageService {
    private static readonly serializer: TSerializer = {
        termsAccepted: (accepted) => String(accepted),
        userId: (data) => JSON.stringify(data),
    };

    private static readonly parser: TParser = {
        termsAccepted: (accepted) => accepted === 'true',
        userId: (data) => JSON.parse(data ?? '{}'),
    };

    public update(storage: Partial<IStorage>): void {
        Object.entries(storage).forEach(([key, value]) => {
            if (value != null) {
                this.set(key as keyof IStorage, value);
            }
        });
    }

    public set<Key extends keyof IStorage>(
        key: Key,
        value: IStorage[Key]
    ): void {
        localStorage.setItem(
            key,
            (StorageService.serializer[key] as any)(value)
        ); // TODO
    }

    public get<Key extends keyof IStorage>(key: Key): IStorage[Key] {
        return StorageService.parser[key](localStorage.getItem(key)) as any; // TODO
    }

    public hasUserId(): boolean {
        const encrypted = localStorage.getItem('multiAccountData');
        const hash = localStorage.getItem('multiAccountHash');

        return !(isNil(hash) || isNil(encrypted));
    }
}

export const storage = new StorageService();


interface IStorage {
    termsAccepted: boolean;
    userId: number;
}

type TSerializer = {
    [Key in keyof IStorage]: (
        data: IStorage[Key]
    ) => IStorage[Key] extends undefined ? string | undefined : string;
};

type TParser = {
    [Key in keyof IStorage]: (data: string | null) => IStorage[Key];
};
