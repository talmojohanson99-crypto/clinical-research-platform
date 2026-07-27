import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4">
        <div className="text-xl font-bold text-purple-700">e-Collect</div>
        <Link
          to="/login"
          className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
        >
          Connexion
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-2 gap-12 items-center">
        {/* Illustration */}
        <div className="flex justify-center">
          <svg viewBox="0 0 400 350" className="w-full max-w-md">
            {/* Background blob */}
            <ellipse cx="200" cy="280" rx="150" ry="20" fill="#e5e7eb" />
            
            {/* Table */}
            <rect x="120" y="180" width="160" height="8" rx="4" fill="#3b82f6" />
            <rect x="140" y="188" width="8" height="80" fill="#3b82f6" />
            <rect x="252" y="188" width="8" height="80" fill="#3b82f6" />
            
            {/* Table items */}
            <rect x="135" y="165" width="40" height="15" rx="2" fill="#22c55e" />
            <circle cx="200" cy="170" r="12" fill="#f97316" />
            <circle cx="200" cy="170" r="6" fill="#fff" />
            <rect x="235" y="158" width="30" height="22" rx="2" fill="#8b5cf6" />
            
            {/* Person */}
            <circle cx="200" cy="100" r="35" fill="#1f2937" /> {/* Hair */}
            <circle cx="200" cy="105" r="28" fill="#fbbf24" /> {/* Face */}
            <circle cx="190" cy="100" r="3" fill="#1f2937" /> {/* Eye */}
            <circle cx="210" cy="100" r="3" fill="#1f2937" /> {/* Eye */}
            <path d="M192 115 Q200 122 208 115" stroke="#1f2937" strokeWidth="2" fill="none" /> {/* Smile */}
            
            {/* Body */}
            <path d="M175 133 L165 200 L235 200 L225 133" fill="#3b82f6" /> {/* Shirt */}
            
            {/* Arms */}
            <path d="M175 145 L140 175" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
            <path d="M225 145 L260 175" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
            
            {/* Hands */}
            <circle cx="140" cy="175" r="8" fill="#fbbf24" />
            <circle cx="260" cy="175" r="8" fill="#fbbf24" />
            
            {/* Laptop */}
            <rect x="155" y="145" width="90" height="55" rx="4" fill="#1f2937" />
            <rect x="160" y="150" width="80" height="45" rx="2" fill="#60a5fa" />
            <rect x="145" y="195" width="110" height="8" rx="4" fill="#374151" />
            
            {/* Plants */}
            <rect x="310" y="200" width="8" height="40" fill="#22c55e" />
            <circle cx="314" cy="195" r="15" fill="#22c55e" />
            <circle cx="305" cy="205" r="12" fill="#16a34a" />
            <circle cx="323" cy="205" r="12" fill="#16a34a" />
            <rect x="300" y="240" width="28" height="25" rx="4" fill="#92400e" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Où la<br />collecte<br />prend vie
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Collectez, analysez et exportez les données de votre essai clinique, en un seul outil. Bilingue FR/MG, export SPSS, conforme RGPD.
          </p>
          <Link
            to="/register"
            className="inline-block bg-purple-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-800"
          >
            Commencer
          </Link>
          <p className="mt-4 text-gray-500">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-purple-700 hover:underline">
              Connexion
            </Link>
          </p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-gray-50 py-16 mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold mb-2">1. Créez votre formulaire</h3>
            <p className="text-gray-500 text-sm">
              Utilisez notre éditeur intuitif pour concevoir vos questionnaires en quelques clics.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold mb-2">2. Collectez les données</h3>
            <p className="text-gray-500 text-sm">
              Sur mobile ou web, même hors-ligne. Les données sont synchronisées automatiquement.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold mb-2">3. Analysez et exportez</h3>
            <p className="text-gray-500 text-sm">
              Visualisez vos résultats en temps réel et exportez en SPSS, Excel ou CSV.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        © 2026 e-Collect. Tous droits réservés.
      </footer>
    </div>
  )
}
