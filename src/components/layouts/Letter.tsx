"use client";
import { Mail } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-border">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <Mail className="w-8 h-8 text-primary" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl text-foreground">
                Giữ liên lạc
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Đăng ký nhận bản tin để nhận ưu đãi độc quyền, mẹo làm đẹp,
                và thông tin về sản phẩm mới
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-3 bg-input-background rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  Đăng ký
                </button>
              </div>

              {subscribed && (
                <p className="mt-4 text-primary text-sm">
                  ✓ Cảm ơn bạn đã đăng ký! Vui lòng kiểm tra hộp thư của bạn.
                </p>
              )}
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
