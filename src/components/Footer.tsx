
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-sketch-gray border-t-2 border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-sketch-blue rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-primary">S</span>
              </div>
              <span className="font-bold text-gray-800">SkillSwap DAO</span>
            </div>
            <p className="text-gray-600 text-sm">
              A decentralized platform for skill exchange, where everyone can learn, teach, and earn.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/marketplace" className="hover:text-primary">Browse Skills</Link></li>
              <li><Link to="/about" className="hover:text-primary">How it Works</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Discord</a></li>
              <li><a href="#" className="hover:text-primary">Twitter</a></li>
              <li><a href="#" className="hover:text-primary">Governance</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-2 border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 SkillSwap DAO. Built for the community, by the community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
