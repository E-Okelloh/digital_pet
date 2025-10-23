import React, { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Heart, Zap, Cookie, Sparkles, Moon, Star, Wallet } from 'lucide-react';

const PACKAGE_ID = '0x2f09b2c57956fa01891d4d4c2e776a04b2fe4232b71c5ba1be94cedc2246562c';
const CLOCK_ID = '0x6';

function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('cat');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (account?.address) {
      fetchPets();
    }
  }, [account]);

  const fetchPets = async () => {
    if (!account?.address) return;
    
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${PACKAGE_ID}::pet::Pet`
        },
        options: {
          showContent: true,
          showType: true
        }
      });

      const petData = objects.data.map(obj => ({
        id: obj.data.objectId,
        ...obj.data.content.fields
      }));

      setPets(petData);
      if (petData.length > 0 && !selectedPet) {
        setSelectedPet(petData[0]);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const mintPet = () => {
    if (!petName.trim()) return;
    
    setIsLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::pet::mint_pet`,
      arguments: [
        tx.pure.string(petName),
        tx.pure.string(petType),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: async () => {
          createParticles('✨');
          setShowMint(false);
          setPetName('');
          await new Promise(resolve => setTimeout(resolve, 2000));
          await fetchPets();
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Mint failed:', error);
          setIsLoading(false);
        }
      }
    );
  };

  const feedPet = () => {
    if (!selectedPet) return;
    
    setIsLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::pet::feed_pet`,
      arguments: [
        tx.object(selectedPet.id),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: async () => {
          createParticles('🍖');
          await new Promise(resolve => setTimeout(resolve, 2000));
          await fetchPets();
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Feed failed:', error);
          setIsLoading(false);
        }
      }
    );
  };

  const playWithPet = () => {
    if (!selectedPet) return;
    
    setIsLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::pet::play_with_pet`,
      arguments: [
        tx.object(selectedPet.id),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: async () => {
          createParticles('❤️');
          await new Promise(resolve => setTimeout(resolve, 2000));
          await fetchPets();
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Play failed:', error);
          setIsLoading(false);
        }
      }
    );
  };

  const restPet = () => {
    if (!selectedPet) return;
    
    setIsLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::pet::rest_pet`,
      arguments: [
        tx.object(selectedPet.id),
        tx.object(CLOCK_ID)
      ]
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: async () => {
          createParticles('💤');
          await new Promise(resolve => setTimeout(resolve, 2000));
          await fetchPets();
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Rest failed:', error);
          setIsLoading(false);
        }
      }
    );
  };

  const createParticles = (emoji) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      emoji,
      x: Math.random() * 100,
      y: Math.random() * 50 + 25
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  };

  const getPetEmoji = (type) => {
    const emojis = { cat: '🐱', dog: '🐶', dragon: '🐉' };
    return emojis[type] || '🐱';
  };

  const getStatColor = (value) => {
    if (value > 70) return 'from-green-500 to-emerald-500';
    if (value > 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getMood = (pet) => {
    if (!pet) return '';
    const happiness = parseInt(pet.happiness);
    const hunger = parseInt(pet.hunger);
    const energy = parseInt(pet.energy);
    
    if (happiness > 70 && hunger > 50) return 'Happy & Healthy! 😊';
    if (hunger < 30) return 'Hungry... 😢';
    if (happiness < 30) return 'Lonely... ��';
    if (energy < 20) return 'Tired... 😴';
    return 'Doing okay 😌';
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center">
          <Wallet className="w-20 h-20 text-white mx-auto mb-6 animate-pulse" />
          <h1 className="text-3xl font-bold text-white mb-4">Digital Pet NFT</h1>
          <p className="text-white/70 mb-6">Connect your wallet to start playing with your pets!</p>
          <ConnectButton className="w-full" />
        </div>
      </div>
    );
  }

  if (showMint || pets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold text-white mb-2">Create Your Pet</h1>
            <p className="text-white/70">Give life to your digital companion</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/90 mb-2 font-medium">Pet Name</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter a cute name..."
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            
            <div>
              <label className="block text-white/90 mb-2 font-medium">Choose Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['cat', 'dog', 'dragon'].map(type => (
                  <button
                    key={type}
                    onClick={() => setPetType(type)}
                    className={`p-4 rounded-xl text-4xl transition-all ${
                      petType === type
                        ? 'bg-white/30 scale-110 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {getPetEmoji(type)}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={mintPet}
              disabled={!petName.trim() || isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {isLoading ? 'Minting...' : 'Mint Pet NFT ✨'}
            </button>

            {pets.length > 0 && (
              <button
                onClick={() => setShowMint(false)}
                className="w-full py-3 bg-white/20 rounded-xl text-white font-medium hover:bg-white/30 transition-all"
              >
                Back to My Pets
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-white/20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 10}px`
            }}
          />
        ))}
      </div>

      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-4xl pointer-events-none animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1)'
          }}
        >
          {particle.emoji}
        </div>
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowMint(true)}
            className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl text-white font-bold hover:bg-white/20 transition-all border border-white/20"
          >
            + Mint New Pet
          </button>
          <ConnectButton />
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{selectedPet?.name}</h1>
              <p className="text-white/70">Level {selectedPet?.level} {selectedPet?.pet_type}</p>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-sm">Experience</div>
              <div className="text-2xl font-bold text-yellow-400">
                {selectedPet?.experience}/{parseInt(selectedPet?.level) * 100}
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{ 
                width: `${(parseInt(selectedPet?.experience || 0) / (parseInt(selectedPet?.level || 1) * 100)) * 100}%` 
              }}
            />
          </div>

          {pets.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPet(pet)}
                  className={`px-4 py-2 rounded-xl text-2xl transition-all ${
                    selectedPet?.id === pet.id
                      ? 'bg-white/30 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {getPetEmoji(pet.pet_type)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="text-9xl mb-6 transition-transform duration-300">
                {getPetEmoji(selectedPet?.pet_type)}
              </div>
              
              <div className="bg-white/20 rounded-2xl p-4 mb-4">
                <div className="text-xl text-white font-medium">{getMood(selectedPet)}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-white">
                      <Cookie className="w-5 h-5" />
                      <span className="font-medium">Hunger</span>
                    </div>
                    <span className="text-white font-bold">{selectedPet?.hunger}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getStatColor(parseInt(selectedPet?.hunger || 0))} transition-all duration-500`}
                      style={{ width: `${selectedPet?.hunger}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Happiness</span>
                    </div>
                    <span className="text-white font-bold">{selectedPet?.happiness}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getStatColor(parseInt(selectedPet?.happiness || 0))} transition-all duration-500`}
                      style={{ width: `${selectedPet?.happiness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-white">
                      <Zap className="w-5 h-5" />
                      <span className="font-medium">Energy</span>
                    </div>
                    <span className="text-white font-bold">{selectedPet?.energy}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getStatColor(parseInt(selectedPet?.energy || 0))} transition-all duration-500`}
                      style={{ width: `${selectedPet?.energy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={feedPet}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Cookie className="w-6 h-6" />
                  {isLoading ? 'Processing...' : 'Feed Pet'}
                </button>

                <button
                  onClick={playWithPet}
                  disabled={isLoading || parseInt(selectedPet?.energy || 0) < 20}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="w-6 h-6" />
                  {isLoading ? 'Processing...' : 'Play Together'}
                </button>

                <button
                  onClick={restPet}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Moon className="w-6 h-6" />
                  {isLoading ? 'Processing...' : 'Rest & Recharge'}
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-3">Tips</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Feed your pet to keep hunger above 50%</li>
                <li>• Play to gain XP and level up!</li>
                <li>• Playing costs energy, so rest when needed</li>
                <li>• Happy pets level up faster 🌟</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
