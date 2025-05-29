
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">S</span>
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-100">SkillSwap DAO</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              A decentralized platform for skill exchange, where everyone can learn, teach, and earn.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/marketplace" className="hover:text-blue-600 dark:hover:text-blue-400">Browse Skills</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">How it Works</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Discord</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Twitter</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Governance</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 SkillSwap DAO. Built for the community, by the community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
